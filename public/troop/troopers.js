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
}

//Dropdown functionality
setupDropdown('add-trooper-grade-btn', 'add-trooper-grade-dropdown');
setupDropdown('add-trooper-size-btn', 'add-trooper-size-dropdown');

function setupDropdown(buttonId, dropdownId) {
    let button = document.getElementById(buttonId);
    let dropdown = document.getElementById(dropdownId);

    button.addEventListener('click', () => {
        dropdown.classList.toggle('block');
        dropdown.classList.toggle('hidden');
    });

    dropdown.querySelectorAll("li").forEach(option => {
        option.addEventListener("click", () => {
            button.textContent = option.textContent;
            button.click();
        });
    });
}
//#endregion ----------------------------------------------------------