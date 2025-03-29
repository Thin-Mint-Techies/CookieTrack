import { showToast, STATUS_COLOR } from "../utils/toasts.js";
import { callApi, uploadDocumentXHR } from "../utils/apiCall.js";
import { regExpCalls, handleTableCreation, handleTableRow, imageStorageHandler } from "../utils/utils.js";
import { createModals } from "../utils/confirmModal.js";
import { handleSkeletons } from "../utils/skeletons.js";
import { manageLoader } from "../utils/loader.js";

//#region CREATE TABLES/LOAD DATA -----------------------------------
let userData, userRole, userTroopers;

//First show skeleton loaders as reward info is waiting to be pulled
const mainContent = document.getElementsByClassName('main-content')[0];
handleSkeletons.rewardSkeleton(mainContent, 2);

//Wait for auth setup then pull user role and rewards
document.addEventListener("authStateReady", async () => {
    userData = JSON.parse(sessionStorage.getItem("userData"));
    userRole = JSON.parse(sessionStorage.getItem('userRole'));

    //Create necessary tables based on user role
    if (userRole && userData.id) {
        //Get the troopers associated with the user
        userTroopers = await callApi(`/troopersOwnerId/${userData.id}`);

        //Load the troop reward data
        const rewardData = await callApi('/reward');

        //Create the table for adding new rewards 
        if (userRole.role === "leader") {
            handleTableCreation.troopRewards(mainContent, openAddRewardModal);
            if (rewardData) loadRewardTableRows(rewardData);
        }

        //Create all the reward boxes for all the users's troopers
        await loadRewardBoxes(userTroopers, rewardData);
    } else {
        showToast("Error Loading Data", "There was an error loading user data. Please refresh the page to try again.", STATUS_COLOR.RED, false);
        return;
    }

    //Remove the skeletons
    handleSkeletons.removeSkeletons(mainContent);
});

function loadRewardTableRows(rewards) {
    rewards.forEach((reward) => {
        const rewardId = reward.id;
        handleTableRow.troopReward(rewardId, reward, editReward, createModals.deleteItem(deleteReward));
    });
}

async function loadRewardBoxes(troopers, rewardData) {
    if (!troopers && userRole.role === "parent") {
        showToast("No Troopers", "There are no troopers in your account to show rewards for.", STATUS_COLOR.RED, false);
        return;
    }

    await Promise.all(troopers.map(async (trooper) => {
        const saleData = await callApi(`/saleData/${trooper.saleDataId}`);

        //Set all the current rewards from trooper to redeemed
        trooper.currentReward.forEach((reward) => {
            reward.redeemed = "Redeemed";
        });

        //Merge the trooper current rewards and rewardData arrays
        let rewards = rewardData;
        if (trooper.currentReward.length > 0 && rewardData.length > 0) {
            // Create a map to merge rewards while prioritizing trooper.currentReward
            const uniqueRewards = new Map();

            // First, add current rewards (ensures redeemed status is kept)
            trooper.currentReward.forEach((reward) => {
                uniqueRewards.set(reward.id, reward);
            });

            // Then, add rewards from rewardData (only if they don't already exist)
            rewardData.forEach((reward) => {
                if (!uniqueRewards.has(reward.id)) {
                    uniqueRewards.set(reward.id, reward);
                }
            });

            rewards = Array.from(uniqueRewards.values());
        }

        //Sort rewards in ascending order based on boxesNeeded
        rewards.sort((a, b) => a.boxesNeeded - b.boxesNeeded);

        // Calculate the number of available rewards (unredeemed and eligible based on boxesSold)
        trooper.available = rewards.filter(reward =>
            reward.redeemed !== "Redeemed" && saleData.totalBoxesSold >= reward.boxesNeeded
        ).length;
        trooper.boxesSold = saleData.totalBoxesSold;

        handleTableCreation.rewardBox(mainContent, trooper, rewards, redeemReward);
    }));
}
//#endregion CREATE TABLES/LOAD DATA --------------------------------

//#region Add/Edit Orders -------------------------------------------
let rewardForm = document.getElementById('reward-form');
let rewardTitle = document.getElementById('reward-title');
let rewardSubtitle = document.getElementById('reward-subtitle');
let rewardCancel = document.getElementById('reward-cancel');
let rewardSubmit = document.getElementById('reward-submit');
let rewardClose = document.getElementById('reward-close');

//Input variables
const rewardName = document.getElementById('reward-name');
const rewardDesc = document.getElementById('reward-description');
const rewardBoxes = document.getElementById('reward-boxes');
const rewardImage = document.getElementById('reward-image');
let selectedFile = null;

function openAddRewardModal(mode = "add", rewardData) {
    if (mode === "edit") {
        rewardTitle.textContent = "Edit Reward";
        rewardSubtitle.textContent = "Edit the selected reward to make changes";
        rewardName.value = rewardData.name;
        rewardDesc.value = rewardData.description;
        rewardBoxes.value = rewardData.boxesNeeded;
    }

    rewardForm.setAttribute('data-mode', mode);
    rewardForm.classList.remove('hidden');
    rewardForm.classList.add('flex');
}

//Close/Cancel the reward modal
rewardClose.addEventListener('click', closeRewardModal, false);
rewardCancel.addEventListener('click', closeRewardModal, false);

function closeRewardModal() {
    rewardTitle.textContent = "Add Reward";
    rewardSubtitle.textContent = "Add a new reward for the troop";
    rewardForm.setAttribute('data-mode', "add");
    rewardForm.classList.remove('flex');
    rewardForm.classList.add('hidden');
    rewardName.value = "";
    rewardDesc.value = "";
    rewardBoxes.value = "";
    rewardImage.value = "";
    selectedFile = null;
}

rewardImage.addEventListener("change", (e) => {
    selectedFile = e.target.files[0];
});

//Verify input and submit new reward
rewardSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const name = rewardName.value.trim();
    const desc = rewardDesc.value.trim() || "";
    const boxes = parseInt(rewardBoxes.value, 10) || 0;
    const currentMode = rewardForm.getAttribute('data-mode');

    if (!name) {
        showToast("Missing Reward Name", "Please make sure you have correctly entered the reward's name.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (boxes === 0) {
        showToast("Missing Boxes Needed", "Please make sure you have entered the number of boxes needed to redeem the reward.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (!selectedFile && currentMode === "add") {
        showToast("Missing Image", "Please make sure you have uploaded an image for the reward.", STATUS_COLOR.RED, true, 5);
        return;
    }

    const rewardData = {
        name: name,
        description: desc,
        boxesNeeded: boxes,
        downloadUrl: selectedFile
    }

    if (currentMode === "add") {
        createRewardApi(rewardData);
    } else if (currentMode === "edit") {
        const rewardId = handleTableRow.currentRowEditing.getAttribute("data-rid");
        updateRewardApi(rewardData, rewardId);
    }
});

async function createRewardApi(rewardData) {
    manageLoader(true);

    try {
        //First compress the reward image and remove it from rewardData
        const compressedImg = await imageStorageHandler.compress(rewardData.downloadUrl, 224, 224);
        delete rewardData.downloadUrl;

        //Next upload the reward
        const rewardId = await callApi('/reward', 'POST', rewardData);

        //Then upload the reward img
        const downloadUrl = await uploadDocumentXHR(`/rewardImg/${rewardId.id}`, compressedImg);
        rewardData.downloadUrl = downloadUrl.downloadURL;

        //Reward created, add to table and show message
        handleTableRow.troopReward(rewardId.id, rewardData, editReward, createModals.deleteItem(deleteReward));
        showToast("Reward Added", "A new reward has been created for the troop.", STATUS_COLOR.GREEN, true, 5);
    } catch (error) {
        console.error('Error creating reward:', error);
        showToast("Error Creating Reward", 'There was an error with creating this reward. Please try again.', STATUS_COLOR.RED, true, 5);
    }

    manageLoader(false);
    rewardClose.click();
}

async function updateRewardApi(rewardData, rewardId) {
    manageLoader(true);

    try {
        let newDownloadUrl = null;
        //First upload the new reward image if there is one
        if (rewardData.downloadUrl !== null) {
            const compressedImg = await imageStorageHandler.compress(rewardData.downloadUrl, 224, 224);
            newDownloadUrl = await uploadDocumentXHR(`/rewardImg/${rewardId}`, compressedImg);
            rewardData.downloadUrl = newDownloadUrl.downloadURL;
        } else {
            //If there is not a new reward image, get the original img link
            const tr = handleTableRow.currentRowEditing;
            const imgSrc = tr.querySelector('img').src;
            rewardData.downloadUrl = imgSrc;
        }

        await callApi(`/reward/${rewardId}`, 'PUT', rewardData);
        //Reward updated, update data in table and show message
        handleTableRow.updateReward(handleTableRow.currentRowEditing, rewardData);
        showToast("Reward Updated", "The selected reward has been updated with the new information.", STATUS_COLOR.GREEN, true, 5);
    } catch (error) {
        console.error('Error updating reward:', error);
        showToast("Error Updating Reward", 'There was an error with updating this reward. Please try again.', STATUS_COLOR.RED, true, 5);
    }

    manageLoader(false);
    rewardClose.click();
}

async function redeemReward(trooperId, rewardId) {
    manageLoader(true);

    try {
        await callApi(`/selectReward/${trooperId}`, 'POST', { rewardId: rewardId, userId: userData.id });
        //Reward selected, update selection in reward box and show message
        const redeemBtn = document.getElementById(trooperId + "-" + rewardId);
        redeemBtn.disabled = true;
        redeemBtn.textContent = "Redeemed";
        redeemBtn.classList.remove("bg-green", "text-white", "hover:bg-green-light");
        redeemBtn.classList.add("bg-green-super-light", "text-black");

        const availableRewards = document.getElementById(trooperId + "-available");
        const availableNum = parseInt(availableRewards.textContent);
        availableRewards.textContent = availableNum - 1;

        showToast("Reward Redeemed", "The chosen reward has been redeemed.", STATUS_COLOR.GREEN, true, 5);
    } catch (error) {
        console.error('Error redeeming reward:', error);
        showToast("Error Redeeming Reward", 'There was an error with redeeming this reward. Please try again.', STATUS_COLOR.RED, true, 5);
    }

    manageLoader(false);
}
//#endregion --------------------------------------------------------

//#region TABLE ACTIONS ---------------------------------------------
function editReward() {
    openAddRewardModal("edit", getRowData(handleTableRow.currentRowEditing));
}

async function deleteReward() {
    manageLoader(true);

    try {
        //First delete reward from storage then from firestore
        const rewardId = handleTableRow.currentRowEditing.getAttribute('data-rid');
        await callApi(`/rewardImg/${rewardId}`, 'DELETE');
        await callApi(`/reward/${rewardId}`, 'DELETE');
        //Reward deleted, remove from tables and show message
        handleTableRow.currentRowEditing.remove();
        showToast("Reward Deleted", "The selected reward has been deleted.", STATUS_COLOR.GREEN, true, 5);
    } catch (error) {
        console.error('Error deleting reward:', error);
        showToast("Error Deleting Reward", 'There was an error with deleting this reward. Please try again.', STATUS_COLOR.RED, true, 5);
    }

    manageLoader(false);
}

function getRowData(row) {
    // Exclude the last <td> (actions)
    let tds = Array.from(row.children).slice(0, -1);
    let index = 0;

    let rewardData = {
        name: tds[index++]?.textContent.trim(),
        description: tds[index++]?.textContent.trim(),
        boxesNeeded: tds[index++]?.textContent.trim(),
    };

    return rewardData;
}

//#endregion TABLE ACTIONS ------------------------------------------