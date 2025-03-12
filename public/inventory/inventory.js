import { showToast, STATUS_COLOR } from "../utils/toasts.js";
import { callApi } from "../utils/apiCall.js";
import { handleTableRow } from "../utils/utils.js";
import { createModals } from "../utils/confirmModal.js";

//#region Add/Edit Inventory -------------------------------------------------
let addTroopCookieBtn = document.getElementById('add-troop-cookies');
let addYourCookieBtn = document.getElementById('add-your-cookies');
let cookieForm = document.getElementById('cookie-form');
let cookieTitle = document.getElementById('cookie-title');
let cookieSubtitle = document.getElementById('cookie-subtitle');
let cookieCancel = document.getElementById('cookie-cancel');
let cookieSubmit = document.getElementById('cookie-submit');
let cookieClose = document.getElementById('cookie-close');
let currentInventory = null;

//Input variables
const cookieName = document.getElementById("cookie-name");
const cookieStock = document.getElementById("cookie-stock");

//Show the add cookie modal
addTroopCookieBtn.addEventListener('click', () => {
    currentInventory = "troop";
    openCookieModal();
});

addYourCookieBtn.addEventListener('click', () => {
    currentInventory = "your";
    openCookieModal();
});

function openCookieModal(mode = "add", cookieData) {
    if (mode === "edit") {
        cookieTitle.textContent = "Edit Cookie";
        cookieSubtitle.textContent = "Edit the selected cookie to make changes";
        cookieName.value = cookieData.cookieName;
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
    cookieStock.value = "";
}

//Verify input and submit new cookie
cookieSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const cName = cookieName.value.trim();
    const cStock = parseInt(cookieStock.value, 10) || 0;

    if (cName === "") {
        showToast("Invalid Cookie Name", "Please make sure that you have correctly entered the cookie's name.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (cStock === 0) {
        showToast("Invalid Cookie Stock", "Please make sure that you have entered the correct box amount for this cookie.", STATUS_COLOR.RED, true, 5);
        return;
    }

    const currentMode = cookieForm.getAttribute('data-mode');

    const cookieData = {
        cookieName: cName,
        boxesInStock: cStock,
        boxesSoldMonth: 0
    }

    if (currentMode === "add") {
        if (currentInventory === "troop") {
            handleTableRow.troopInventory(cookieData, editCookie, createModals.deleteItem(deleteCookie));
        } else if (currentInventory === "your") {
            handleTableRow.yourInventory(cookieData, editCookie, createModals.deleteItem(deleteCookie));
        }
        showToast("Cookie Added", "A new cookie has been added to the inventory.", STATUS_COLOR.GREEN, true, 5);
    } else if (currentMode === "edit") {
        handleTableRow.updateInventoryRow(handleTableRow.currentRowEditing, cookieData);
        showToast("Cookie Updated", "The selected cookie has been updated with the new information.", STATUS_COLOR.GREEN, true, 5);
    }

    cookieClose.click();
});
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
        cookieName: tds[index++]?.textContent.trim(),
        boxesInStock: tds[index++]?.textContent.trim(),
        boxesSoldMonth: tds[index++]?.textContent.trim()
    }

    return cookieData;
}
//#endregion TABLE ACTIONS ------------------------------------------

//#region TEST DATA -------------------------------------------------
const troopInventory = {
    0: {
        cookieName: "Thin Mints",
        boxesInStock: 400,
        boxesSoldMonth: 0
    },
    1: {
        cookieName: "Lemonades",
        boxesInStock: 200,
        boxesSoldMonth: 0
    },
    2: {
        cookieName: "Adventurefuls",
        boxesInStock: 300,
        boxesSoldMonth: 0
    },
    3: {
        cookieName: "Caramel Chocolate Chip",
        boxesInStock: 500,
        boxesSoldMonth: 0
    },
    4: {
        cookieName: "Do-si-dos",
        boxesInStock: 100,
        boxesSoldMonth: 0
    },
    5: {
        cookieName: "Caramel deLites",
        boxesInStock: 200,
        boxesSoldMonth: 0
    }
};

const yourInventory = {
    0: {
        cookieName: "Thin Mints",
        boxesInStock: 40,
        boxesSoldMonth: 0
    },
    1: {
        cookieName: "Lemonades",
        boxesInStock: 20,
        boxesSoldMonth: 0
    },
    2: {
        cookieName: "Adventurefuls",
        boxesInStock: 30,
        boxesSoldMonth: 0
    },
    3: {
        cookieName: "Caramel Chocolate Chip",
        boxesInStock: 50,
        boxesSoldMonth: 0
    },
    4: {
        cookieName: "Do-si-dos",
        boxesInStock: 10,
        boxesSoldMonth: 0
    },
    5: {
        cookieName: "Caramel deLites",
        boxesInStock: 20,
        boxesSoldMonth: 0
    }
};

const needInventory = {
    0: {
        cookieName: "Thin Mints",
        boxesNeeded: 100
    },
    1: {
        cookieName: "Lemonades",
        boxesNeeded: 50
    }
};

(function loadTestData() {
    for (const [key, value] of Object.entries(troopInventory)) {
        handleTableRow.troopInventory(value, editCookie, createModals.deleteItem(deleteCookie));
    };
    for (const [key, value] of Object.entries(yourInventory)) {
        handleTableRow.yourInventory(value, editCookie, createModals.deleteItem(deleteCookie));
    };
    for (const [key, value] of Object.entries(needInventory)){
        handleTableRow.needInventory(value, editCookie, createModals.deleteItem(deleteCookie));
    };
})();
//#endregion --------------------------------------------------------