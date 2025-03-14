import { showToast, STATUS_COLOR } from "../utils/toasts.js";
import { callApi } from "../utils/apiCall.js";
import { regExpCalls, setupDropdown, handleTableRow, searchTableRows, handleTableCreation } from "../utils/utils.js";
import { createModals } from "../utils/confirmModal.js";
import { handleSkeletons } from "../utils/skeletons.js";

//#region CREATE TABLES/LOAD DATA -----------------------------------
//First create all the necessary tables
const mainContent = document.getElementsByClassName('main-content')[0];
handleTableCreation.allTrooper(mainContent);
handleTableCreation.yourTrooper(mainContent);

//Then show skeleton loaders as the trooper information is pulled from database
handleSkeletons.hideNeedSkeletons(mainContent);
handleSkeletons.tableSkeleton(mainContent, 2);
setTimeout(() => {
    handleSkeletons.removeSkeletons(mainContent);
}, 2000);

//Next setup the filters for the tables
searchTableRows.allTroopers("all-troopers-search");
//#endregino CREATE TABLES/LOAD DATA --------------------------------

//#region Add Trooper -------------------------------------------------
let addTrooperBtn = document.getElementById('add-trooper');
let trooperForm = document.getElementById('trooper-form');
let trooperTitle = document.getElementById('trooper-title');
let trooperSubtitle = document.getElementById('trooper-subtitle');
let trooperCancel = document.getElementById('trooper-cancel');
let trooperSubmit = document.getElementById('trooper-submit');
let trooperClose = document.getElementById('trooper-close');

//Input variables
const trooperNumber = document.getElementById("trooper-number");
const trooperName = document.getElementById("trooper-name");
const trooperAge = document.getElementById("trooper-age");
const trooperGrade = document.getElementById("trooper-grade-btn");
const trooperSize = document.getElementById("trooper-size-btn");
const trooperLeader = document.getElementById("trooper-leader");

//Dropdown functionality
setupDropdown('trooper-grade-btn', 'trooper-grade-dropdown');
setupDropdown('trooper-size-btn', 'trooper-size-dropdown');

//Show the add trooper modal
addTrooperBtn.addEventListener('click', () => {
    openTrooperModal();
});

function openTrooperModal(mode = "add", trooperData) {
    if (mode === "edit") {
        trooperTitle.textContent = 'Edit Trooper';
        trooperSubtitle.textContent = "Edit the selected trooper to make changes";
        trooperNumber.value = trooperData.troopNumber;
        trooperName.value = trooperData.trooperName;
        trooperLeader.value = trooperData.troopLeader;
        trooperAge.value = trooperData.age;
        trooperGrade.textContent = trooperData.grade;
        trooperSize.textContent = trooperData.shirtSize;
    }

    trooperForm.setAttribute("data-mode", mode);
    trooperForm.classList.remove('hidden');
    trooperForm.classList.add('flex');
}

//Close/Cancel the trooper modal
trooperClose.addEventListener('click', closeAddTrooperModal, false);
trooperCancel.addEventListener('click', closeAddTrooperModal, false);

function closeAddTrooperModal() {
    trooperTitle.textContent = "Add Trooper";
    trooperSubtitle.textContent = "Add a new trooper to your account";
    trooperForm.setAttribute('data-mode', "add");
    trooperForm.classList.remove('flex');
    trooperForm.classList.add('hidden');
    trooperNumber.value = "";
    trooperName.value = "";
    trooperLeader.value = "";
    trooperAge.value = "";
    trooperGrade.textContent = "Select Grade Level";
    trooperSize.textContent = "Select Shirt/Jacket Size";
}

//Verify input and add a new trooper
trooperSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const pUid = userData.id;
    const pName = userData.name;
    const number = trooperNumber.value.trim();
    const name = trooperName.value.trim();
    const age = parseInt(trooperAge.value, 10) || 0;
    const grade = trooperGrade.textContent;
    const size = trooperSize.textContent;
    const leader = trooperLeader.value.trim();

    if (number === null || number === "") {
        showToast("Invalid Trooper Number", "Please make sure you have correctly entered the trooper number.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (!regExpCalls.testFullName(name) || !regExpCalls.testFullName(leader)) {
        showToast("Invalid Name", "Please make sure you have correctly entered the trooper and leader name.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (age === 0) {
        showToast("Invalid Age", "Please make sure you have correctly entered an age greater than 0.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (grade.includes("Select") || size.includes("Select")) {
        showToast("Missing Information", "Please make sure you have selected a grade level and shirt size.", STATUS_COLOR.RED, true, 5);
        return;
    }

    const currentMode = trooperForm.getAttribute('data-mode');

    const trooperData = {
        troopNumber: number,
        trooperName: name,
        ownerId: pUid,
        parentName: pName,
        troopLeader: leader,
        age: age,
        grade: grade,
        shirtSize: size,
        currentBalance: (0.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 0,
    }

    if (currentMode === "add") {
        handleTableRow.yourTrooper(trooperData, editTrooperData, createModals.deleteItem(deleteTrooper));
        handleTableRow.allTrooper(trooperData, editTrooperData, createModals.deleteItem(deleteTrooper));
        showToast("Trooper Added", "A new trooper has been created for your account.", STATUS_COLOR.GREEN, true, 5);
    } else if (currentMode === "edit") {
        handleTableRow.updateTrooperRow(handleTableRow.currentRowEditing, trooperData);
        showToast("Trooper Updated", "The selected trooper has been updated with the new information.", STATUS_COLOR.GREEN, true, 5);
    }

    trooperClose.click();
});
//#endregion ----------------------------------------------------------

//#region TABLE ACTIONS ---------------------------------------------
function editTrooperData() {
    openTrooperModal("edit", getRowData(handleTableRow.currentRowEditing));
}

function deleteTrooper() {
    handleTableRow.currentRowEditing.remove();
    showToast("Trooper Deleted", "The selected trooper has been removed from your account.", STATUS_COLOR.GREEN, true, 5);
}

function getRowData(row) {
    //Exclude the first and last <td> (dropdown and actions)
    let tds = Array.from(row.children).slice(1, -1);
    let index = 0;

    let trooperData = {
        troopNumber: tds[index++]?.textContent.trim(),
        trooperName: tds[index++]?.textContent.trim(),
        parentName: tds[index++]?.textContent.trim(),
        troopLeader: tds[index++]?.textContent.trim(),
        currentBalance: tds[index++]?.textContent.trim(),
        boxesSold: tds[index++]?.textContent.trim(),
        age: tds[index++]?.textContent.trim(),
        grade: tds[index++]?.textContent.trim(),
        shirtSize: tds[index++]?.textContent.trim(),
    }

    return trooperData;
}

//Table dropdown for individual troopers
document.querySelectorAll('tr .show-row').forEach((btn) => {
    btn.addEventListener('click', () => {
        let arrow = btn.querySelector('i');
        let hiddenRow = btn.parentElement.nextElementSibling;

        if (arrow.classList.contains('fa-caret-down')) {
            hiddenRow.classList.remove('hidden');
            arrow.className = 'fa-solid fa-caret-up text-xl';
        } else {
            hiddenRow.classList.add('hidden');
            arrow.className = 'fa-solid fa-caret-down text-xl';
        }
    });
});
//#endregion TABLE ACTIONS ------------------------------------------

//#region TEST DATA -------------------------------------------------
const allTroopers = {
    0: {
        troopNumber: "Troop5581",
        trooperName: "Sally Jackson",
        parentName: "Tammy Jackson",
        troopLeader: "Shawn Guiser",
        age: 5,
        grade: "Kindergarten",
        shirtSize: "XS",
        currentBalance: (25.5).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 15
    },
    1: {
        troopNumber: "Troop5581",
        trooperName: "Emily Carter",
        parentName: "John Carter",
        troopLeader: "Shawn Guiser",
        age: 6,
        grade: "1st Grade",
        shirtSize: "S",
        currentBalance: (10.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 10
    },
    2: {
        troopNumber: "Troop5581",
        trooperName: "Olivia Smith",
        parentName: "Rachel Smith",
        troopLeader: "Shawn Guiser",
        age: 7,
        grade: "2nd Grade",
        shirtSize: "M",
        currentBalance: (30.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 20
    },
    3: {
        troopNumber: "Troop5581",
        trooperName: "Sophia Johnson",
        parentName: "David Johnson",
        troopLeader: "Shawn Guiser",
        age: 8,
        grade: "3rd Grade",
        shirtSize: "L",
        currentBalance: (15.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 12
    },
    4: {
        troopNumber: "Troop5581",
        trooperName: "Ava Martinez",
        parentName: "Lisa Martinez",
        troopLeader: "Shawn Guiser",
        age: 9,
        grade: "4th Grade",
        shirtSize: "XL",
        currentBalance: (20.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 18
    },
    5: {
        troopNumber: "Troop5582",
        trooperName: "Mia Davis",
        parentName: "Mark Davis",
        troopLeader: "Kelly Rogers",
        age: 10,
        grade: "5th Grade",
        shirtSize: "M",
        currentBalance: (12.5).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 8
    },
    6: {
        troopNumber: "Troop5582",
        trooperName: "Charlotte White",
        parentName: "Nancy White",
        troopLeader: "Kelly Rogers",
        age: 11,
        grade: "6th Grade",
        shirtSize: "L",
        currentBalance: (5.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 5
    },
    7: {
        troopNumber: "Troop5582",
        trooperName: "Amelia Brown",
        parentName: "Steve Brown",
        troopLeader: "Kelly Rogers",
        age: 12,
        grade: "7th Grade",
        shirtSize: "S",
        currentBalance: (40.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 25
    },
    8: {
        troopNumber: "Troop5583",
        trooperName: "Harper Lewis",
        parentName: "Sarah Lewis",
        troopLeader: "Jessica Hall",
        age: 13,
        grade: "8th Grade",
        shirtSize: "M",
        currentBalance: (35.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 22
    },
    9: {
        troopNumber: "Troop5583",
        trooperName: "Evelyn Harris",
        parentName: "Chris Harris",
        troopLeader: "Jessica Hall",
        age: 14,
        grade: "9th Grade",
        shirtSize: "L",
        currentBalance: (18.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 14
    },
    10: {
        troopNumber: "Troop5583",
        trooperName: "Abigail King",
        parentName: "Tom King",
        troopLeader: "Jessica Hall",
        age: 15,
        grade: "10th Grade",
        shirtSize: "XL",
        currentBalance: (27.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 19
    },
    11: {
        troopNumber: "Troop5583",
        trooperName: "Ella Scott",
        parentName: "Diane Scott",
        troopLeader: "Jessica Hall",
        age: 16,
        grade: "11th Grade",
        shirtSize: "S",
        currentBalance: (50.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 30
    },
    12: {
        troopNumber: "Troop5584",
        trooperName: "Scarlett Perez",
        parentName: "Lucas Perez",
        troopLeader: "Angela Morris",
        age: 17,
        grade: "12th Grade",
        shirtSize: "M",
        currentBalance: (22.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 16
    },
    13: {
        troopNumber: "Troop5584",
        trooperName: "Grace Adams",
        parentName: "Paula Adams",
        troopLeader: "Angela Morris",
        age: 9,
        grade: "4th Grade",
        shirtSize: "XS",
        currentBalance: (8.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 6
    },
    14: {
        troopNumber: "Troop5584",
        trooperName: "Lily Nelson",
        parentName: "James Nelson",
        troopLeader: "Angela Morris",
        age: 10,
        grade: "5th Grade",
        shirtSize: "L",
        currentBalance: (14.5).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 11
    },
    15: {
        troopNumber: "Troop5581",
        trooperName: "Emily Jackson",
        parentName: "Tammy Jackson",
        troopLeader: "Shawn Guiser",
        age: 7,
        grade: "2nd Grade",
        shirtSize: "S",
        currentBalance: (12.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 9
    }
};


const yourTroopers = {
    0: {
        troopNumber: "Troop5581",
        trooperName: "Sally Jackson",
        parentName: "Tammy Jackson",
        troopLeader: "Shawn Guiser",
        age: 5,
        grade: "Kindergarten",
        shirtSize: "XS",
        currentBalance: (25.5).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 15
    },
    1: {
        troopNumber: "Troop5581",
        trooperName: "Emily Jackson",
        parentName: "Tammy Jackson",
        troopLeader: "Shawn Guiser",
        age: 7,
        grade: "2nd Grade",
        shirtSize: "S",
        currentBalance: (12.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        boxesSold: 9
    }
};


(function loadTestData() {
    for (const [key, value] of Object.entries(allTroopers)) {
        handleTableRow.allTrooper(value, editTrooperData, createModals.deleteItem(deleteTrooper));
    };
    for (const [key, value] of Object.entries(yourTroopers)) {
        handleTableRow.yourTrooper(value, editTrooperData, createModals.deleteItem(deleteTrooper));
    };
})();
//#endregion --------------------------------------------------------