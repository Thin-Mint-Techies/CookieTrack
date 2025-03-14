import { showToast, STATUS_COLOR } from "../utils/toasts.js";
import { callApi } from "../utils/apiCall.js";
import { regExpCalls, setupDropdown, handleTableRow, searchTableRows, handleTableCreation } from "../utils/utils.js";
import { createModals } from "../utils/confirmModal.js";
import { handleSkeletons } from "../utils/skeletons.js";

//#region CREATE TABLES/LOAD DATA -----------------------------------
//First create all the necessary tables
const mainContent = document.getElementsByClassName('main-content')[0];
handleTableCreation.yourDocuments(mainContent);
handleTableCreation.currentOrder(mainContent);
handleTableCreation.completedOrder(mainContent);

//Then show skeleton loaders as the order information is pulled from database
handleSkeletons.hideNeedSkeletons(mainContent);
handleSkeletons.tableSkeleton(mainContent, 3);
setTimeout(() => {
    handleSkeletons.removeSkeletons(mainContent);
}, 2000);

//Next setup the filters for the tables
searchTableRows.currentOrders("current-orders-search", "current-orders-datestart", "current-orders-dateend", "current-orders-clear-filters");
searchTableRows.completedOrders("completed-orders-search", "completed-orders-datestart", "completed-orders-dateend", "completed-orders-clear-filters");
//#endregino CREATE TABLES/LOAD DATA --------------------------------

//#region Add/Edit Orders -------------------------------------------
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

//#region TEST DATA -------------------------------------------------
const currentOrders = {
    0: {
        dateCreated: "3/09/2025",
        trooperName: "Alice Smith",
        parentName: "Tammy Smith",
        boxTotal: 5,
        orderContent: {
            adventurefuls: 1,
            toastyays: 0,
            lemonades: 1,
            trefoils: 0,
            thinMints: 0,
            pbPatties: 0,
            caramelDelites: 0,
            pbSandwich: 1,
            gfChocChip: 2
        },
        pickup: "Shawn's House",
        contact: "(817) 999-1234",
        finacialAgreement: "Agreed"
    },
    1: {
        dateCreated: "3/10/2025",
        trooperName: "Emma Johnson",
        parentName: "Michael Johnson",
        boxTotal: 8,
        orderContent: {
            adventurefuls: 2,
            toastyays: 1,
            lemonades: 0,
            trefoils: 1,
            thinMints: 2,
            pbPatties: 1,
            caramelDelites: 0,
            pbSandwich: 0,
            gfChocChip: 1
        },
        pickup: "Shawn's House",
        contact: "(214) 555-6789",
        finacialAgreement: "Agreed"
    },
    2: {
        dateCreated: "3/04/2025",
        trooperName: "Sophia Brown",
        parentName: "David Brown",
        boxTotal: 6,
        orderContent: {
            adventurefuls: 1,
            toastyays: 1,
            lemonades: 2,
            trefoils: 0,
            thinMints: 1,
            pbPatties: 0,
            caramelDelites: 1,
            pbSandwich: 0,
            gfChocChip: 0
        },
        pickup: "Shawn's House",
        contact: "(469) 777-4321",
        finacialAgreement: "Agreed"
    },
    3: {
        dateCreated: "2/15/2025",
        trooperName: "Olivia Martinez",
        parentName: "Carlos Martinez",
        boxTotal: 10,
        orderContent: {
            adventurefuls: 3,
            toastyays: 0,
            lemonades: 2,
            trefoils: 1,
            thinMints: 2,
            pbPatties: 0,
            caramelDelites: 1,
            pbSandwich: 1,
            gfChocChip: 0
        },
        pickup: "Shawn's House",
        contact: "(972) 333-9876",
        finacialAgreement: "Agreed"
    },
    4: {
        dateCreated: "3/12/2025",
        trooperName: "Mia Wilson",
        parentName: "Sara Wilson",
        boxTotal: 4,
        orderContent: {
            adventurefuls: 0,
            toastyays: 2,
            lemonades: 0,
            trefoils: 0,
            thinMints: 1,
            pbPatties: 1,
            caramelDelites: 0,
            pbSandwich: 0,
            gfChocChip: 0
        },
        pickup: "Shawn's House",
        contact: "(817) 123-4567",
        finacialAgreement: "Agreed"
    }
};

const completedOrders = {
    0: {
        dateCreated: "1/19/2025",
        dateCompleted: "2/01/2025",
        trooperName: "Lilly Joe",
        parentName: "Donny Joe",
        boxTotal: 5,
        orderContent: {
            adventurefuls: 1,
            toastyays: 0,
            lemonades: 1,
            trefoils: 0,
            thinMints: 0,
            pbPatties: 0,
            caramelDelites: 0,
            pbSandwich: 1,
            gfChocChip: 2
        },
        pickup: "Shawn's House",
        contact: "(817) 888-1234",
        finacialAgreement: "Agreed"
    },
    1: {
        dateCreated: "3/10/2025",
        dateCompleted: "3/12/2025",
        trooperName: "Zoe Adams",
        parentName: "Henry Adams",
        boxTotal: 7,
        orderContent: {
            adventurefuls: 1,
            toastyays: 1,
            lemonades: 1,
            trefoils: 1,
            thinMints: 1,
            pbPatties: 1,
            caramelDelites: 1,
            pbSandwich: 0,
            gfChocChip: 0
        },
        pickup: "Shawn's House",
        contact: "(214) 666-5432",
        finacialAgreement: "Agreed"
    },
    2: {
        dateCreated: "2/05/2025",
        dateCompleted: "2/10/2025",
        trooperName: "Charlotte Green",
        parentName: "Linda Green",
        boxTotal: 6,
        orderContent: {
            adventurefuls: 2,
            toastyays: 0,
            lemonades: 0,
            trefoils: 2,
            thinMints: 1,
            pbPatties: 0,
            caramelDelites: 1,
            pbSandwich: 0,
            gfChocChip: 0
        },
        pickup: "Shawn's House",
        contact: "(817) 777-1122",
        finacialAgreement: "Agreed"
    },
    3: {
        dateCreated: "2/15/2025",
        dateCompleted: "2/17/2025",
        trooperName: "Ava Thomas",
        parentName: "Robert Thomas",
        boxTotal: 9,
        orderContent: {
            adventurefuls: 3,
            toastyays: 2,
            lemonades: 1,
            trefoils: 0,
            thinMints: 2,
            pbPatties: 0,
            caramelDelites: 1,
            pbSandwich: 0,
            gfChocChip: 0
        },
        pickup: "Shawn's House",
        contact: "(469) 888-7654",
        finacialAgreement: "Agreed"
    }
};


(function loadTestData() {
    for (const [key, value] of Object.entries(currentOrders)) {
        handleTableRow.currentOrder(value, editCurrentOrder, createModals.deleteItem(deleteCurrentOrder), createModals.completeOrder(completeCurrentOrder));
    };
    for (const [key, value] of Object.entries(completedOrders)) {
        handleTableRow.completedOrder(value, editCompletedOrder, createModals.deleteItem(deleteCompletedOrder));
    };
})();
//#endregion --------------------------------------------------------