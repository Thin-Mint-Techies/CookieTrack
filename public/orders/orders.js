import { showToast, STATUS_COLOR } from "../utils/toasts.js";
import { callApi } from "../utils/apiCall.js";
import { regExpCalls, setupDropdown, addOptionToDropdown, handleTableRow, searchTableRows, handleTableCreation } from "../utils/utils.js";
import { createModals } from "../utils/confirmModal.js";
import { handleSkeletons } from "../utils/skeletons.js";
import { openFileUploadModal, formatFileSize, downloadFile, deleteUploadedFile } from "./uploadFiles.js";
import { manageLoader } from "../utils/loader.js";

//#region CREATE TABLES/LOAD DATA -----------------------------------
let userData, userRole, userTroopers;

//First show skeleton loaders as order info is waiting to be pulled
const mainContent = document.getElementsByClassName('main-content')[0];
handleSkeletons.tableSkeleton(mainContent, 3);

//Wait for auth setup then pull user role and orders
document.addEventListener("authStateReady", async () => {
    userData = JSON.parse(sessionStorage.getItem("userData"));
    userRole = JSON.parse(sessionStorage.getItem('userRole'));

    //Create necessary tables based on user role
    if (userRole && userData) {
        //Create table and setup filters
        handleTableCreation.yourDocuments(mainContent, openFileUploadModal);
        handleTableCreation.currentOrder(mainContent, openOrderModal);
        handleTableCreation.completedOrder(mainContent);
        searchTableRows.currentOrders("current-orders-search", "current-orders-datestart", "current-orders-dateend", "current-orders-clear-filters");
        searchTableRows.completedOrders("completed-orders-search", "completed-orders-datestart", "completed-orders-dateend", "completed-orders-clear-filters");

        //Load the documents that the user has if any
        loadFileTableRows(userData.documents);

        //Get the troopers associated with the user
        userTroopers = await callApi(`/troopersOwnerId/${userData.id}`);
        if (userRole.role === "parent") {
            //const userOrders = await callApi(`/ordersUsers/${userData.id}`);
            //loadOrderTableRows(userOrders, true);
        } else if (userRole.role === "leader") {
            //const allOrders = await callApi('/order');
            //loadOrderTableRows(allOrders, true);
        }

        setupAndLoadDropdowns();
    } else {
        showToast("Error Loading Data", "There was an error loading user data. Please refresh the page to try again.", STATUS_COLOR.RED, false);
        return;
    }

    //Remove the skeletons and setup add order modal
    handleSkeletons.removeSkeletons(mainContent);
});

function loadOrderTableRows(orders, isCurrentOrders) {
    orders.forEach((order) => {
        const orderData = {

        }

        if (isCurrentOrders) {
            handleTableRow.currentOrder(orderData, editCurrentOrder, createModals.deleteItem(deleteCurrentOrder), createModals.completeOrder(completeCurrentOrder));
        } else {
            handleTableRow.completedOrder(orderData, editCompletedOrder, createModals.deleteItem(deleteCompletedOrder));
        }
    });
}

function loadFileTableRows(files) {
    if (!files) return;
    files.forEach((file) => {
        const fileData = {
            fileName: file.name,
            fileSize: formatFileSize(file.size),
            dateUploaded: new Date(file.dateUploaded).toLocaleDateString("en-US"),
        }

        handleTableRow.yourDocuments(file.url, fileData, downloadFile, createModals.deleteItem(deleteUploadedFile));
    });
}
//#endregion CREATE TABLES/LOAD DATA --------------------------------

//#region Add/Edit Orders -------------------------------------------
let orderForm = document.getElementById('order-form');
let orderTitle = document.getElementById('order-title');
let orderSubtitle = document.getElementById('order-subtitle');
let orderCancel = document.getElementById('order-cancel');
let orderSubmit = document.getElementById('order-submit');
let orderClose = document.getElementById('order-close');

//Input variables
const orderTrooper = document.getElementById("order-trooper-btn");
const orderBEmail = document.getElementById("order-bemail");
const orderAdventurefuls = document.getElementById("order-adventurefuls");
const orderToastyays = document.getElementById("order-toastyays");
const orderLemonades = document.getElementById("order-lemonades");
const orderTrefoils = document.getElementById("order-trefoils");
const orderThinMints = document.getElementById("order-thinmints");
const orderPBPatties = document.getElementById("order-pbpatties");
const orderCaramelDelites = document.getElementById("order-carameldelites");
const orderPBSandwich = document.getElementById("order-pbsandwich");
const orderGFChocChip = document.getElementById("order-gfchocchip");
const orderPickup = document.getElementById("order-pickup-btn");
const orderContact = document.getElementById("order-contact-btn");
const orderPayment = document.getElementById("order-payment-btn");
const orderAgreement = document.getElementById("order-agreement");

//Setup dropdowns
function setupAndLoadDropdowns() {
    setupDropdown('order-pickup-btn', 'order-pickup-dropdown');
    setupDropdown('order-contact-btn', 'order-contact-dropdown');
    setupDropdown('order-payment-btn', 'order-payment-dropdown');

    //Load troopers into dropdown
    if (userTroopers) {
        userTroopers.forEach((trooper) => {
            addOptionToDropdown('order-trooper-dropdown', trooper.trooperName, trooper.id);
        });
    } else {
        addOptionToDropdown('order-trooper-dropdown', "No Troopers in Account", null);
    }
    
    setupDropdown('order-trooper-btn', 'order-trooper-dropdown');
}

function openOrderModal(mode = "add", orderData) {
    if (mode === "edit") {
        orderTitle.textContent = "Edit Order";
        orderSubtitle.textContent = "Edit the selected order to make changes";
        orderTrooper.value = orderData.trooperId;
        orderTrooper.textContent = orderData.trooperName;
        orderBEmail.value = orderData.buyerEmail;
        orderAdventurefuls.value = orderData.orderContent.adventurefuls;
        orderToastyays.value = orderData.orderContent.toastyays;
        orderLemonades.value = orderData.orderContent.lemonades;
        orderTrefoils.value = orderData.orderContent.trefoils;
        orderThinMints.value = orderData.orderContent.thinMints;
        orderPBPatties.value = orderData.orderContent.pbPatties;
        orderCaramelDelites.value = orderData.orderContent.caramelDelites;
        orderPBSandwich.value = orderData.orderContent.pbSandwich;
        orderGFChocChip.value = orderData.orderContent.gfChocChip;
        orderPickup.textContent = orderData.pickup;
        orderContact.textContent = regExpCalls.testPhone(orderData.contact) ? "Phone" : "Email";
        orderPayment.textContent = orderData.paymentType;
        orderAgreement.checked = orderData.finacialAgreement === "Agreed" ? true : false;
    }

    orderForm.setAttribute('data-mode', mode);
    orderForm.classList.remove('hidden');
    orderForm.classList.add('flex');
}

//Close/Cancel the order modal
orderClose.addEventListener('click', closeOrderModal, false);
orderCancel.addEventListener('click', closeOrderModal, false);

function closeOrderModal() {
    orderTitle.textContent = "Add Order";
    orderSubtitle.textContent = "Add a new order to your account";
    orderForm.setAttribute('data-mode', "add");
    orderForm.classList.remove('flex');
    orderForm.classList.add('hidden');
    orderTrooper.value = "";
    orderTrooper.textContent = "Select Trooper";
    orderBEmail.value = "";
    orderAdventurefuls.value = "";
    orderToastyays.value = "";
    orderLemonades.value = "";
    orderTrefoils.value = "";
    orderThinMints.value = "";
    orderPBPatties.value = "";
    orderCaramelDelites.value = "";
    orderPBSandwich.value = "";
    orderGFChocChip.value = "";
    orderPickup.textContent = "Select Location";
    orderContact.textContent = "Select Preference";
    orderPayment.textContent = "Select Payment Type";
    orderAgreement.checked = false;
}

//Verify input and submit new order
orderSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const tId = orderTrooper.value;
    const tName = orderTrooper.textContent.trim();
    const bEmail = orderBEmail.value.trim();
    const pUid = userData.id;
    const pName = userData.name;
    const pEmail = userData.email;
    const pPhone = userData.phone;

    const adventurefuls = parseInt(orderAdventurefuls.value, 10) || 0;
    const toastyays = parseInt(orderToastyays.value, 10) || 0;
    const lemonades = parseInt(orderLemonades.value, 10) || 0;
    const trefoils = parseInt(orderTrefoils.value, 10) || 0;
    const thinMints = parseInt(orderThinMints.value, 10) || 0;
    const pbPatties = parseInt(orderPBPatties.value, 10) || 0;
    const caramelDelites = parseInt(orderCaramelDelites.value, 10) || 0;
    const pbsandwich = parseInt(orderPBSandwich.value, 10) || 0;
    const gfChocChip = parseInt(orderGFChocChip.value, 10) || 0;

    const pickup = orderPickup.textContent.trim();
    const contact = orderContact.textContent.trim();
    const payment = orderPayment.textContent.trim();
    const finacialAgreement = orderAgreement.checked;

    if (tName.includes("Select")) {
        showToast("Missing Trooper", "Please make sure you have selected a trooper.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (!regExpCalls.testEmail(bEmail)) {
        showToast("Invalid Buyer Email", "Please make sure you have correctly entered the buyer's email.", STATUS_COLOR.RED, true, 5);
        return;
    }

    const orderItems = [adventurefuls, toastyays, lemonades, trefoils, thinMints, pbPatties, caramelDelites, pbsandwich, gfChocChip];

    if (orderItems.every(item => item === 0)) {
        showToast("Missing Information", "Please make sure you have entered at least one box sale in the order.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (pickup.includes("Select") || contact.includes("Select") || payment.includes("Select")) {
        showToast("Missing Information", "Please make sure you have selected a pickup location, contact preference, and payment type.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (!finacialAgreement) {
        showToast("Accept Agreement", "You must accept the financial agreement before submitting this order.", STATUS_COLOR.RED, true, 5);
        return;
    }

    const currentMode = orderForm.getAttribute('data-mode');

    const orderBoxes = {
        adventurefuls: adventurefuls,
        toastyays: toastyays,
        lemonades: lemonades,
        trefoils: trefoils,
        thinMints: thinMints,
        pbPatties: pbPatties,
        caramelDelites: caramelDelites,
        pbSandwich: pbsandwich,
        gfChocChip: gfChocChip
    };

    const orderContent = {
        cookies: [{

        },],
        totalCost: 0,
        owe: 0,
        boxTotal: Object.values(orderBoxes).reduce((sum, num) => sum + num, 0)
    }

    const pickupDetails = [
        {
            receivedBy: 'Received By',
            address: pickup,
        },
        {
            receivedFrom: 'Received From',
        }
    ];

    const orderData = {
        dateCreated: currentMode === "add" ? new Date().toLocaleDateString("en-US") : null,
        trooperId: tId,
        trooperName: tName,
        ownerId: pUid,
        ownerEmail: pEmail,
        buyerEmail: bEmail,
        parentName: pName,
        orderContent: orderContent,
        pickupDetails: pickupDetails,
        contact: contact === "Phone" ? pPhone : pEmail,
        paymentType: payment,
        finacialAgreement: finacialAgreement === true ? "Agreed" : "Declined"
    }

    if (currentMode === "add") {
        createOrderApi(orderData);
    } else if (currentMode === "edit") {
        const orderId = handleTableRow.currentRowEditing.getAttribute("data-oid");
        updateOrderApi(orderData, orderId);
    }
});

async function createOrderApi(orderData) {
    manageLoader(true);

    try {
        const orderId = await callApi('/order', 'POST', orderData);
        //Order created, add to table and show message
        handleTableRow.currentOrder(orderId.id, orderData, editCurrentOrder, createModals.deleteItem(deleteCurrentOrder), createModals.completeOrder(completeCurrentOrder));
        showToast("Order Added", "A new order has been created for your account.", STATUS_COLOR.GREEN, true, 5);
    } catch (error) {
        console.error('Error creating order:', error);
        showToast("Error Creating Order", 'There was an error with creating this order. Please try again.', STATUS_COLOR.RED, true, 5);
    }

    manageLoader(false);
    orderClose.click();
}

async function updateOrderApi(orderData, orderId) {
    manageLoader(true);

    try {
        await callApi(`/order/${orderId}`, 'PUT', orderData);
        //Order updated, update data in table and show message
        handleTableRow.updateOrderRow(handleTableRow.currentRowEditing, orderData);
        showToast("Order Updated", "The selected order has been updated with the new information.", STATUS_COLOR.GREEN, true, 5);
    } catch (error) {
        console.error('Error updating order:', error);
        showToast("Error Updating Order", 'There was an error with updating this order. Please try again.', STATUS_COLOR.RED, true, 5);
    }

    manageLoader(false);
    orderClose.click();
}
//#endregion --------------------------------------------------------

//#region TABLE ACTIONS ---------------------------------------------
function completeCurrentOrder() {
    handleTableRow.completedOrder(getRowData(handleTableRow.currentRowEditing, true, true), editCompletedOrder, createModals.deleteItem(deleteCompletedOrder));
    handleTableRow.currentRowEditing.remove();
    showToast("Order Completed", "The selected order has been completed and moved to the Completed Orders table.", STATUS_COLOR.GREEN, true, 5);
}

function editCurrentOrder() {
    openOrderModal("edit", getRowData(handleTableRow.currentRowEditing, false));
}

function deleteCurrentOrder() {
    handleTableRow.currentRowEditing.remove();
    showToast("Order Deleted", "The selected order has been deleted.", STATUS_COLOR.GREEN, true, 5);
}

function editCompletedOrder() {
    openOrderModal("edit", getRowData(handleTableRow.currentRowEditing, true));
}

function deleteCompletedOrder() {
    handleTableRow.currentRowEditing.remove();
    showToast("Order Deleted", "The selected order has been deleted.", STATUS_COLOR.GREEN, true, 5);
}

function getRowData(row, isCompletedOrders = false, needsDate = false) {
    // Exclude the last <td> (actions)
    let tds = Array.from(row.children).slice(0, -1);
    let index = 0;

    let orderData = {
        dateCreated: tds[index++]?.textContent.trim(),
        ...(isCompletedOrders ? {
            dateCompleted: needsDate ? new Date().toLocaleDateString('en-US') : tds[index++]?.textContent.trim()
        } : null),
        trooperName: tds[index++]?.textContent.trim(),
        parentName: tds[index++]?.textContent.trim(),
        boxTotal: Number(tds[index++]?.textContent.trim()) || 0,
        orderContent: {
            adventurefuls: Number(tds[index++]?.textContent.trim()) || 0,
            toastyays: Number(tds[index++]?.textContent.trim()) || 0,
            lemonades: Number(tds[index++]?.textContent.trim()) || 0,
            trefoils: Number(tds[index++]?.textContent.trim()) || 0,
            thinMints: Number(tds[index++]?.textContent.trim()) || 0,
            pbPatties: Number(tds[index++]?.textContent.trim()) || 0,
            caramelDelites: Number(tds[index++]?.textContent.trim()) || 0,
            pbSandwich: Number(tds[index++]?.textContent.trim()) || 0,
            gfChocChip: Number(tds[index++]?.textContent.trim()) || 0
        },
        pickup: tds[index++]?.textContent.trim(),
        contact: tds[index++]?.textContent.trim(),
        finacialAgreement: tds[index++]?.textContent.trim()
    };

    return orderData;
}

//#endregion TABLE ACTIONS ------------------------------------------