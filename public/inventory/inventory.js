import { showToast, STATUS_COLOR } from "../utils/toasts.js";
import { callApi } from "../utils/apiCall.js";
import { handleSkeletons } from "../utils/skeletons.js";
import { handleTableRow, handleTableCreation } from "../utils/utils.js";
import { createModals } from "../utils/confirmModal.js";
import { manageLoader } from "../utils/loader.js";

//#region CREATE TABLES/LOAD DATA -----------------------------------
let userData, userRole;

//First show skeleton loaders as inventory info is waiting to be pulled
const mainContent = document.getElementsByClassName('main-content')[0];
handleSkeletons.tableSkeleton(mainContent, 3);

//Wait for auth setup then pull user role and inventory
document.addEventListener("authStateReady", async () => {
    userData = JSON.parse(sessionStorage.getItem("userData"));
    userRole = JSON.parse(sessionStorage.getItem('userRole'));

    //Create necessary tables based on user role
    if (userRole && userData.id) {
        if (userRole.role === "parent") {
            handleTableCreation.yourInventory(mainContent);
            //loadInventoryTableRows();
        } else if (userRole.role === "leader") {
            handleTableCreation.troopInventory(mainContent, openCookieModal);
            handleTableCreation.needInventory(mainContent);
            handleTableCreation.yourInventory(mainContent);
        }
    } else {
        showToast("Error Loading Data", "There was an error loading user data. Please refresh the page to try again.", STATUS_COLOR.RED, false);
        return;
    }

    //Remove the skeletons and setup add cookie modal
    handleSkeletons.removeSkeletons(mainContent);
});

function loadInventoryTableRows(inventory, inventoryType) {
    inventory.forEach((cookie) => {
        const cookieData = {

        }

        if (inventoryType === "troop") {
            handleTableRow.troopInventory(cookieData, editCookie, createModals.deleteItem(deleteCookie));
        } else if (inventoryType === "need") {
            handleTableRow.needInventory(cookieData, editCookie, createModals.deleteItem(deleteCookie));
        } else if (inventoryType === "your") {
            handleTableRow.yourInventory(cookieData, editCookie, createModals.deleteItem(deleteCookie));
        }
    });
}
//#endregion CREATE TABLES/LOAD DATA --------------------------------

//#region Add/Edit Inventory -------------------------------------------------
let cookieForm = document.getElementById('cookie-form');
let cookieTitle = document.getElementById('cookie-title');
let cookieSubtitle = document.getElementById('cookie-subtitle');
let cookieCancel = document.getElementById('cookie-cancel');
let cookieSubmit = document.getElementById('cookie-submit');
let cookieClose = document.getElementById('cookie-close');

//Input variables
const cookieName = document.getElementById("cookie-name");
const cookiePrice = document.getElementById("cookie-price");
const cookieStock = document.getElementById("cookie-stock");

//Show the add cookie modal
function openCookieModal(mode = "add", cookieData) {
    if (mode === "edit") {
        cookieTitle.textContent = "Edit Cookie";
        cookieSubtitle.textContent = "Edit the selected cookie to make changes";
        cookieName.value = cookieData.variety;
        cookiePrice.value = cookieData.price;
        cookieStock.value = cookieData.boxesInStock;
    }

    cookieForm.setAttribute('data-mode', mode);
    cookieForm.classList.remove('hidden');
    cookieForm.classList.add('flex');
}

//Close/Cancel the cookie modal
cookieClose.addEventListener('click', closeCookieModal, false);
cookieCancel.addEventListener('click', closeCookieModal, false);

function closeCookieModal() {
    cookieTitle.textContent = "Add Cookie";
    cookieSubtitle.textContent = "Add a new cookie to the inventory";
    cookieForm.setAttribute('data-mode', "add");
    cookieForm.classList.remove('flex');
    cookieForm.classList.add('hidden');
    cookieName.value = "";
    cookiePrice.value = "";
    cookieStock.value = "";
}

//Verify input and submit new cookie
cookieSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const cName = cookieName.value.trim();
    const cPrice = parseFloat(cookiePrice.value) || 0;
    const cStock = parseInt(cookieStock.value, 10) || 0;

    if (cName === "") {
        showToast("Invalid Cookie Name", "Please make sure that you have correctly entered the cookie's name.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (cPrice === 0) {
        showToast("Invalid Cookie Price", "Please make sure that you have entered the correct price for this cookie.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (cStock === 0) {
        showToast("Invalid Cookie Stock", "Please make sure that you have entered the correct box amount for this cookie.", STATUS_COLOR.RED, true, 5);
        return;
    }

    const currentMode = cookieForm.getAttribute('data-mode');

    const cookieData = {
        variety: cName,
        description: "",
        price: (cPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    }

    if (currentMode === "add") {
        createCookieApi(cookieData);
    } else if (currentMode === "edit") {
        const cookieId = handleTableRow.currentRowEditing.getAttribute('data-cid');
        updateCookieApi(cookieData);
    }
});

async function createCookieApi(cookieData) {
    manageLoader(true);

    try {
        const cookieId = await callApi('/cookie', 'POST', cookieData);
        //Cookie created, add to table and show message
        delete cookieData.description;
        handleTableRow.troopInventory(cookieId.id, cookieData, editCookie, createModals.deleteItem(deleteCookie));
        showToast("Cookie Added", "A new cookie has been created and added to the troop inventory.", STATUS_COLOR.GREEN, true, 5);
    } catch (error) {
        console.error('Error creating cookie:', error);
        showToast("Error Creating Cookie", 'There was an error with creating this cookie. Please try again.', STATUS_COLOR.RED, true, 5);
    }

    manageLoader(false);
    cookieClose.click();
}

async function updateCookieApi(cookieData, cookieId) {
    manageLoader(true);

    try {
        await callApi(`/cookie/${cookieId}`, 'PUT', cookieData);
        //Cookie updated, update data in table and show message
        delete cookieData.description;
        handleTableRow.updateInventoryRow(handleTableRow.currentRowEditing, cookieData);
        showToast("Cookie Updated", "The selected cookie has been updated with the new information.", STATUS_COLOR.GREEN, true, 5);
    } catch (error) {
        console.error('Error updating cookie:', error);
        showToast("Error Updating Cookie", 'There was an error with updating this cookie. Please try again.', STATUS_COLOR.RED, true, 5);
    }

    manageLoader(false);
    cookieClose.click();
}
//#endregion --------------------------------------------------------

//#region TABLE ACTIONS ---------------------------------------------
function editCookie() {
    openCookieModal("edit", getRowData(handleTableRow.currentRowEditing));
}

function deleteCookie() {
    handleTableRow.currentRowEditing.remove();
    showToast("Cookie Deleted", "The selected cookie has been deleted.", STATUS_COLOR.GREEN, true, 5);
}

function getRowData(row) {
    //Exclude the last <td> (actions)
    let tds = Array.from(row.children).slice(0, -1);
    let index = 0;

    let cookieData = {
        variety: tds[index++]?.textContent.trim(),
        price: tds[index++]?.textContent.trim().replace("$", ''),
        boxesInStock: tds[index++]?.textContent.trim()
    }

    return cookieData;
}
//#endregion TABLE ACTIONS ------------------------------------------