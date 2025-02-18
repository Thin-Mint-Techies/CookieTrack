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

//Grade level dropdown functionality
let addTrooperGradeBtn = document.getElementById('add-trooper-grade-btn');
let addTrooperGradeDropdown = document.getElementById('add-trooper-grade-dropdown');

addTrooperGradeBtn.addEventListener('click', () => {
    if (addTrooperGradeDropdown.className.includes('block')) {
        addTrooperGradeDropdown.classList.add('hidden')
        addTrooperGradeDropdown.classList.remove('block')
    } else {
        addTrooperGradeDropdown.classList.add('block')
        addTrooperGradeDropdown.classList.remove('hidden')
    }
});

document.querySelectorAll("#add-trooper-grade-dropdown li").forEach(option => {
    option.addEventListener("click", () => {
        addTrooperGradeBtn.textContent = option.textContent;
        addTrooperGradeBtn.click();
    });
});

//Grade level dropdown functionality
let addTrooperSizeBtn = document.getElementById('add-trooper-size-btn');
let addTrooperSizeDropdown = document.getElementById('add-trooper-size-dropdown');

addTrooperSizeBtn.addEventListener('click', () => {
    if (addTrooperSizeDropdown.className.includes('block')) {
        addTrooperSizeDropdown.classList.add('hidden')
        addTrooperSizeDropdown.classList.remove('block')
    } else {
        addTrooperSizeDropdown.classList.add('block')
        addTrooperSizeDropdown.classList.remove('hidden')
    }
});

document.querySelectorAll("#add-trooper-size-dropdown li").forEach(option => {
    option.addEventListener("click", () => {
        addTrooperSizeBtn.textContent = option.textContent;
        addTrooperSizeBtn.click();
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
//#endregion ----------------------------------------------------------