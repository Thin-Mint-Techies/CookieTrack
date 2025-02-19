import { showToast, STATUS_COLOR } from "../utils/toasts.js";
import { callApi } from "../utils/apiCall.js";
import { regExpCalls, setupDropdown } from "../utils/utils.js";

//#region Add Order -------------------------------------------------
let addOrderBtn = document.getElementById('add-order');
let addOrderForm = document.getElementById('add-order-form');
let addOrderCancel = document.getElementById('add-order-cancel');
let addOrderSubmit = document.getElementById('add-order-submit');
let addOrderClose = document.getElementById('add-order-close');

//Show the add order modal
addOrderBtn.addEventListener('click', () => {
    addOrderForm.classList.remove('hidden');
    addOrderForm.classList.add('flex');
});

//Close/Cancel the file upload modal
addOrderClose.addEventListener('click', closeAddOrderModal, false);
addOrderCancel.addEventListener('click', closeAddOrderModal, false);

function closeAddOrderModal() {
    addOrderForm.classList.remove('flex');
    addOrderForm.classList.add('hidden');
    addOrderTName.value = "";
    addOrderAdventurefuls.value = "";
    addOrderToastyays.value = "";
    addOrderLemonades.value = "";
    addOrderTrefoils.value = "";
    addOrderThinMints.value = "";
    addOrderPBPatties.value = "";
    addOrderCaramelDelites.value = "";
    addOrderPBSandwich.value = "";
    addOrderGFChocChip.value = "";
    addOrderPickup.textContent = "Select Location";
    addOrderContact.textContent = "Select Preference";
    addOrderAgreement.checked = false;
}

//Input variables
const addOrderTName = document.getElementById("add-order-tname");
const addOrderAdventurefuls = document.getElementById("add-order-adventurefuls");
const addOrderToastyays = document.getElementById("add-order-toastyays");
const addOrderLemonades = document.getElementById("add-order-lemonades");
const addOrderTrefoils = document.getElementById("add-order-trefoils");
const addOrderThinMints = document.getElementById("add-order-thinmints");
const addOrderPBPatties = document.getElementById("add-order-pbpatties");
const addOrderCaramelDelites = document.getElementById("add-order-carameldelites");
const addOrderPBSandwich = document.getElementById("add-order-pbsandwich");
const addOrderGFChocChip = document.getElementById("add-order-gfchocchip");
const addOrderPickup = document.getElementById("add-order-pickup-btn");
const addOrderContact = document.getElementById("add-order-contact-btn");
const addOrderAgreement = document.getElementById("add-order-agreement");

//Setup dropdowns
setupDropdown('add-order-pickup-btn', 'add-order-pickup-dropdown');
setupDropdown('add-order-contact-btn', 'add-order-contact-dropdown');

//Verify input and submit new order
addOrderSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const tName = addOrderTName.value.trim();
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const pUid = userData.id;
    const pName = userData.name;
    const email = userData.email;
    const phone = userData.phone;

    const adventurefuls = parseInt(addOrderAdventurefuls.value, 10) || 0;
    const toastyays = parseInt(addOrderToastyays.value, 10) || 0;
    const lemonades = parseInt(addOrderLemonades.value, 10) || 0;
    const trefoils = parseInt(addOrderTrefoils.value, 10) || 0;
    const thinMints = parseInt(addOrderThinMints.value, 10) || 0;
    const pbPatties = parseInt(addOrderPBPatties.value, 10) || 0;
    const caramelDelites = parseInt(addOrderCaramelDelites.value, 10) || 0;
    const pbsandwich = parseInt(addOrderPBSandwich.value, 10) || 0;
    const gfChocChip = parseInt(addOrderGFChocChip.value, 10) || 0;

    const pickup = addOrderPickup.textContent;
    const contact = addOrderContact.textContent;
    const finacialAgreement = addOrderAgreement.checked;

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

    const orderData = {
        dateCreated: new Date().toLocaleDateString("en-US"),
        trooperName: tName,
        parentName: pName,
        ownerId: pUid,
        orderContent: {
            adventurefuls: adventurefuls,
            toastyays: toastyays,
            lemonades: lemonades,
            trefoils: trefoils,
            thinMints: thinMints,
            pbPatties: pbPatties,
            caramelDelites: caramelDelites,
            pbSandwich: pbsandwich,
            gfChocChip: gfChocChip
        },
        pickup: pickup,
        contact: contact === "Phone" ? phone : email,
        finacialAgreement: finacialAgreement === true ? "Agreed" : "Declined"
    }

    addRowToCurrentOrders(orderData);
    addOrderClose.click();
});
//#endregion --------------------------------------------------------

//#region ADD TABLE ROW ---------------------------------------------
function addRowToCurrentOrders(data) {
    const tbody = document.getElementById("current-orders-tbody");
    tbody.appendChild(createTableRow(data));
}

function createTableRow(data) {
    // Create the table row
    let tr = document.createElement("tr");
    tr.className = "even:bg-gray text-sm text-black [&_td]:p-4";

    // Data fields to display
    let fields = [
        "dateCreated", "trooperName", "parentName", "adventurefuls", "toastyays", "lemonades",
        "trefoils", "thinMints", "pbPatties", "caramelDelites", "pbSandwich", "gfChocChip", "pickup",
        "contact", "finacialAgreement"
    ];

    // Populate the row with data fields
    fields.forEach(field => {
        let td = document.createElement("td");
        // If field exists in orderContent, get it from orderContent, otherwise get it from the main data object
        td.textContent = data.orderContent?.[field] || data[field] || ""; // Handle missing or undefined fields
        tr.appendChild(td);
    });

    // Create the action buttons column
    let actionTd = document.createElement("td");

    // Button configurations
    let buttons = [
        { title: "Complete", iconClass: "fa-clipboard-check text-green hover:text-green-light" },
        { title: "Edit", iconClass: "fa-pen-to-square text-blue hover:text-blue-light" },
        { title: "Delete", iconClass: "fa-trash-can text-red hover:text-red-light" }
    ];

    buttons.forEach(btn => {
        let button = document.createElement("button");
        button.className = "mr-4";
        button.title = btn.title;

        let icon = document.createElement("i");
        icon.className = `fa-solid ${btn.iconClass} text-xl`;

        button.appendChild(icon);
        actionTd.appendChild(button);
    });

    tr.appendChild(actionTd);

    return tr;
}

//#endregion --------------------------------------------------------