import { showToast, STATUS_COLOR } from "../utils/toasts.js";
import { callApi } from "../utils/apiCall.js";
import { regExpCalls, setupDropdown, handleTableRow } from "../utils/utils.js";
import { createModals } from "../utils/confirmModal.js";

//#region Add/Edit Orders -------------------------------------------------
let addOrderBtn = document.getElementById('add-order');
let orderForm = document.getElementById('order-form');
let orderTitle = document.getElementById('order-title');
let orderSubtitle = document.getElementById('order-subtitle');
let orderCancel = document.getElementById('order-cancel');
let orderSubmit = document.getElementById('order-submit');
let orderClose = document.getElementById('order-close');

//Input variables
const orderTName = document.getElementById("order-tname");
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
const orderAgreement = document.getElementById("order-agreement");

//Setup dropdowns
setupDropdown('order-pickup-btn', 'order-pickup-dropdown');
setupDropdown('order-contact-btn', 'order-contact-dropdown');

//Show the add order modal version
addOrderBtn.addEventListener('click', () => {
    openOrderModal();
});

function openOrderModal(mode = "add", orderData) {
    if (mode === "edit") {
        orderTitle.textContent = "Edit Order";
        orderSubtitle.textContent = "Edit the selected order to make changes";
        orderTName.value = orderData.trooperName;
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
    orderTName.value = "";
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
    orderAgreement.checked = false;
}

//Verify input and submit new order
orderSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const tName = orderTName.value.trim();
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const pUid = userData.id;
    const pName = userData.name;
    const email = userData.email;
    const phone = userData.phone;

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
    const finacialAgreement = orderAgreement.checked;

    if (!regExpCalls.testFullName(tName)) {
        showToast("Invalid Trooper Name", "Please make sure you have correctly entered the trooper name.", STATUS_COLOR.RED, true, 5);
        return;
    }

    const orderItems = [adventurefuls, toastyays, lemonades, trefoils, thinMints, pbPatties, caramelDelites, pbsandwich, gfChocChip];

    if (orderItems.every(item => item === 0)) {
        showToast("Missing Information", "Please make sure you have entered at least one box sale in the order.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (pickup.includes("Select") || contact.includes("Select")) {
        showToast("Missing Information", "Please make sure you have selected a pickup location and contact preference.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (!finacialAgreement) {
        showToast("Accept Agreement", "You must accept the financial agreement before submitting this order.", STATUS_COLOR.RED, true, 5);
        return;
    }

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

    const currentMode = orderForm.getAttribute('data-mode');

    const orderData = {
        dateCreated: currentMode === "add" ? new Date().toLocaleDateString("en-US") : null,
        trooperName: tName,
        parentName: currentMode === "add" ? pName : null,
        ownerId: currentMode === "add" ? pUid : null,
        boxTotal: Object.values(orderBoxes).reduce((sum, num) => sum + num, 0),
        ...(currentMode === "add" ? { orderContent: orderBoxes } : orderBoxes),
        pickup: pickup,
        contact: contact === "Phone" ? phone : email,
        finacialAgreement: finacialAgreement === true ? "Agreed" : "Declined"
    }

    if (currentMode === "add") {
        handleTableRow.currentOrder(orderData, editCurrentOrder, createModals.deleteItem(deleteCurrentOrder), createModals.completeOrder(completeCurrentOrder));
        showToast("Order Added", "A new order has been created for your account.", STATUS_COLOR.GREEN, true, 5);
    } else if (currentMode === "edit") {
        handleTableRow.updateOrderRow(handleTableRow.currentRowEditing, orderData);
        showToast("Order Updated", "The selected order has been updated with the new information.", STATUS_COLOR.GREEN, true, 5);
    }

    orderClose.click();
});
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