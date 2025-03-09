import { showToast, STATUS_COLOR } from "../utils/toasts.js";
import { callApi } from "../utils/apiCall.js";
import { regExpCalls, setupDropdown, handleTableRow } from "../utils/utils.js";

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

//#region Add Trooper -------------------------------------------------
let addTrooperBtn = document.getElementById('add-trooper');
let addTrooperForm = document.getElementById('add-trooper-form');
let addTrooperCancel = document.getElementById('add-trooper-cancel');
let addTrooperSubmit = document.getElementById('add-trooper-submit');
let addTrooperClose = document.getElementById('add-trooper-close');

//Show the add trooper modal
addTrooperBtn.addEventListener('click', () => {
    addTrooperForm.classList.remove('hidden');
    addTrooperForm.classList.add('flex');
});

//Close/Cancel the file upload modal
addTrooperClose.addEventListener('click', closeAddTrooperModal, false);
addTrooperCancel.addEventListener('click', closeAddTrooperModal, false);

function closeAddTrooperModal() {
    addTrooperForm.classList.remove('flex');
    addTrooperForm.classList.add('hidden');
    addTrooperNumber.value = "";
    addTrooperName.value = "";
    addTrooperAge.value = "";
    addTrooperGrade.textContent = "Select Grade Level";
    addTrooperSize.textContent = "Select Shirt/Jacket Size";
    addTrooperLeader.value = "";
}

//Input variables
const addTrooperNumber = document.getElementById("add-trooper-number");
const addTrooperName = document.getElementById("add-trooper-name");
const addTrooperAge = document.getElementById("add-trooper-age");
const addTrooperGrade = document.getElementById("add-trooper-grade-btn");
const addTrooperSize = document.getElementById("add-trooper-size-btn");
const addTrooperLeader = document.getElementById("add-trooper-leader");

//Dropdown functionality
setupDropdown('add-trooper-grade-btn', 'add-trooper-grade-dropdown');
setupDropdown('add-trooper-size-btn', 'add-trooper-size-dropdown');

//Verify input and add a new trooper
addTrooperSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const pUid = userData.id;
    const number = addTrooperNumber.value.trim();
    const name = addTrooperName.value.trim();
    const age = parseInt(addTrooperAge.value, 10) || 0;
    const grade = addTrooperGrade.textContent;
    const size = addTrooperSize.textContent;
    const leader = addTrooperLeader.value.trim();

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

    const trooperData = {
        trooperNumber: number,
        trooperName: name,
        ownerId: pUid,
        age: age,
        grade: grade,
        shirtSize: size,
        troopLeader: leader,
        boxesSold: 0,
        currentBalance: 0.0
    }

    handleTableRow.yourTrooper(trooperData, testEdit, testDelete);
    addTrooperClose.click();
});

function testEdit() {
    alert("edit");
}

function testDelete() {
    alert("delete");
}
//#endregion ----------------------------------------------------------