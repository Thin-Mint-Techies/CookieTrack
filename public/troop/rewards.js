import { showToast, STATUS_COLOR } from "../utils/toasts.js";
import { callApi } from "../utils/apiCall.js";
import { regExpCalls, handleTableCreation, handleTableRow } from "../utils/utils.js";
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
        //userTroopers = await callApi(`/troopersOwnerId/${userData.id}`);

        //Create the table for adding new rewards 
        if (userRole.role === "leader") {
            handleTableCreation.troopRewards(mainContent, openAddRewardModal);

            //const rewardData = await callApi('/reward');
            //if (rewardData) loadRewardTableRows(rewardData);
        } 

        //Create all the reward boxes for all the parent's troopers
        //userTroopers.forEach((trooper) => {
            //handleTableCreation.rewardBox(mainContent, trooper);
        //});
    } else {
        showToast("Error Loading Data", "There was an error loading user data. Please refresh the page to try again.", STATUS_COLOR.RED, false);
        return;
    }

    //Remove the skeletons
    handleSkeletons.removeSkeletons(mainContent);
});

function loadRewardTableRows(rewards) {
    rewards.forEach((reward) => {
        handleTableRow.troopReward(reward.id, reward, editReward, createModals.deleteItem(deleteReward));
    });
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

function openAddRewardModal(mode = "add", rewardData) {
    if (mode === "edit") {
        rewardTitle.textContent = "Edit Reward";
        rewardSubtitle.textContent = "Edit the selected reward to make changes";
        rewardName.value = rewardData.name;
        rewardDesc.value = rewardData.description;
        rewardBoxes.value = rewardData.boxesNeeded;
        rewardImage.value = rewardData.imageLink;
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
}

//Verify input and submit new reward
rewardSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const name = rewardName.value.trim();
    const desc = rewardDesc.value.trim();
    const boxes = parseInt(rewardBoxes.value, 10) || 0;
    const img = rewardImage.value;

    if (!name) {
        showToast("Missing Reward Name", "Please make sure you have correctly entered the reward's name.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (!desc) {
        showToast("Missing Description", "Please make sure you have entered a description for the reward.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (boxes === 0) {
        showToast("Missing Boxes Needed", "Please make sure you have entered the number of boxes needed to redeem the reward.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (!img) {
        showToast("Missing Image", "Please make sure you have uploaded an image for the reward.", STATUS_COLOR.RED, true, 5);
        return;
    }

    const currentMode = orderForm.getAttribute('data-mode');

    const rewardData = {
        name: name,
        description: desc,
        imageLink: img,
        boxesNeeded: boxes
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
        const rewardId = await callApi('/reward', 'POST', rewardData);
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
//#endregion --------------------------------------------------------

//#region TABLE ACTIONS ---------------------------------------------
function editReward() {
    openRewardModal("edit", getRowData(handleTableRow.currentRowEditing));
}

async function deleteReward() {
    manageLoader(true);

    try {
        const rewardId = handleTableRow.currentRowEditing.getAttribute('data-rid');
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
        imageLink: tds[index++]?.textContent.trim()
    };

    return rewardData;
}

//#endregion TABLE ACTIONS ------------------------------------------