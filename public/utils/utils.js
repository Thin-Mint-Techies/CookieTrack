//#region REGEX TESTS -----------------------------------------------
const expressions = {
    name: new RegExp(/^[a-zA-Z]+(?:[-'][a-zA-Z]+)?$/),
    fullName: new RegExp(/^[a-zA-Z]+(?:[-'][a-zA-Z]+)?(?:\s[a-zA-Z]+(?:[-'][a-zA-Z]+)?)?$/),
    email: new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm, "gm"),
    phone: new RegExp(/^\(\d{3}\) \d{3}-\d{4}$/),
    password: new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/gm, "gm")
}

const regExpCalls = {
    testName: function (name) {
        return expressions.name.test(name);
    },
    testFullName: function (fullName) {
        return expressions.fullName.test(fullName);
    },
    testEmail: function (email) {
        return expressions.email.test(email);
    },
    testPhone: function (phone) {
        return expressions.phone.test(phone);
    },
    testPassword: function (password) {
        return expressions.password.test(password);
    }
}
//#endregion --------------------------------------------------------

//#region PHONE NUMBER INPUT ----------------------------------------
function setupPhoneInput(inputElem) {
    inputElem.addEventListener('keydown', disallowNonNumericInput);
    inputElem.addEventListener('keyup', formatToPhone);

    function disallowNonNumericInput(e) {
        if (e.ctrlKey) { return; }
        if (e.key.length > 1) { return; }
        if (/[0-9.]/.test(e.key)) { return; }
        e.preventDefault();
    }

    function formatToPhone(e) {
        const digits = e.target.value.replace(/\D/g, '').substring(0, 10);
        const areaCode = digits.substring(0, 3);
        const prefix = digits.substring(3, 6);
        const suffix = digits.substring(6, 10);

        if (digits.length > 6) { e.target.value = `(${areaCode}) ${prefix} - ${suffix}`; }
        else if (digits.length > 3) { e.target.value = `(${areaCode}) ${prefix}`; }
        else if (digits.length > 0) { e.target.value = `(${areaCode}`; }
    }
}
//#endregion --------------------------------------------------------

//#region DROPDOWNS -------------------------------------------------
function setupDropdown(buttonId, dropdownId) {
    let button = document.getElementById(buttonId);
    let dropdown = document.getElementById(dropdownId);

    button.addEventListener('click', (e) => {
        e.stopPropagation();

        // Close all other dropdowns
        document.querySelectorAll('ul[id*="dropdown"]').forEach(otherDropdown => {
            if (otherDropdown !== dropdown) {
                otherDropdown.classList.add('hidden');
                otherDropdown.classList.remove('block');
            }
        });

        dropdown.classList.toggle('block');
        dropdown.classList.toggle('hidden');
    });

    dropdown.querySelectorAll("li").forEach(option => {
        option.addEventListener("click", () => {
            button.textContent = option.textContent;
            button.click();
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!button.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
            dropdown.classList.remove('block');
        }
    });
}
//#endregion --------------------------------------------------------

//#region TABLE ROWS ------------------------------------------------
const handleTableRow = {
    currentOrder: (data) => addOrderRow(data, true),
    completedOrder: (data) => addOrderRow(data, false),
    yourTrooper: (data) => addTrooperRow(data),
    yourDocuments: (data) => addFileRow(data),
    updateOrderRow: (row, data) => editRowData(row, orderFields, data)
}

const orderFields = [
    "dateCreated", "trooperName", "parentName", "boxTotal", "adventurefuls", "toastyays", "lemonades",
    "trefoils", "thinMints", "pbPatties", "caramelDelites", "pbSandwich", "gfChocChip", "pickup",
    "contact", "finacialAgreement"
];

const completedOrderFields = [
    orderFields[0], "dateCompleted", ...orderFields.slice(1)
];

const trooperFields = [
    "trooperNumber", "trooperName", "age", "grade", "shirtSize", "troopLeader"
];

const fileFields = [
    "fileName", "fileSize", "dateUploaded"
];

function setupRowFields(tr, hasDropdown, fields, data, buttons) {
    if (hasDropdown) {
        //Create the dropdown td
        let arrowTd = document.createElement("td");
        arrowTd.className = "show-row !py-[11px] !pl-[18px] !pr-[6px] w-[10px] cursor-pointer";

        let icon = document.createElement("i");
        icon.className = "fa-solid fa-caret-down text-xl";

        arrowTd.appendChild(icon);
        tr.appendChild(arrowTd);
    }

    // Populate the row with data fields
    fields.forEach(field => {
        let td = document.createElement("td");
        // If field exists in orderContent, get it from orderContent, otherwise get it from the main data object
        td.textContent = data.orderContent?.[field] ?? data[field] ?? ""; // Handle missing or undefined fields
        tr.appendChild(td);
    });

    // Create the action buttons column
    let actionTd = document.createElement("td");

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
}

function addOrderRow(data, isCurrentOrder) {
    const tableName = isCurrentOrder ? "current" : "completed";
    const tbody = document.getElementById(`${tableName}-orders-tbody`);
    const fields = isCurrentOrder ? orderFields : completedOrderFields;
    let tr = document.createElement("tr");
    tr.className = "even:bg-gray text-sm text-black [&_td]:p-4";

    // Button configurations
    let buttons = [
        isCurrentOrder && { title: "Complete", iconClass: "fa-clipboard-check text-green hover:text-green-light" },
        { title: "Edit", iconClass: "fa-pen-to-square text-blue hover:text-blue-light" },
        { title: "Delete", iconClass: "fa-trash-can text-red hover:text-red-light" }
    ].filter(Boolean); // Removes `false` values if `isCurrentOrder` is true

    setupRowFields(tr, false, fields, data, buttons);
    tbody.appendChild(tr);
}

function addTrooperRow(data) {
    const tbody = document.getElementById("your-troopers-tbody");
    let tr = document.createElement("tr");
    tr.className = "even:bg-gray text-sm text-black [&_td]:p-4";

    // Button configurations
    let buttons = [
        { title: "Edit", iconClass: "fa-pen-to-square text-blue hover:text-blue-light" },
        { title: "Delete", iconClass: "fa-trash-can text-red hover:text-red-light" }
    ];

    setupRowFields(tr, true, trooperFields, data, buttons);
    tbody.appendChild(tr);

    //Now add a hidden row after the main row
    let hiddenTr = document.createElement("tr");
    hiddenTr.className = "hidden-row hidden";

    let hiddenTd = document.createElement("td");
    hiddenTd.className = "pl-12 text-sm";
    hiddenTd.colSpan = fields.length + 1;

    let hiddenDiv = document.createElement("div");
    hiddenDiv.className = "p-4 border-2 border-gray rounded-default";
    hiddenDiv.textContent = "Info about trooper.";

    hiddenTd.appendChild(hiddenDiv);
    hiddenTr.appendChild(hiddenTd);
    tbody.appendChild(hiddenTr);
}

function addFileRow(data) {
    const tbody = document.getElementById("your-documents-tbody");
    let tr = document.createElement("tr");
    tr.className = "even:bg-gray text-sm text-black [&_td]:p-4";

    // Button configurations
    let buttons = [
        { title: "Download", iconClass: "fa-cloud-arrow-down text-blue hover:text-blue-light" },
        { title: "Delete", iconClass: "fa-trash-can text-red hover:text-red-light" }
    ];

    setupRowFields(tr, false, fileFields, data, buttons);
    tbody.appendChild(tr);
}

function editRowData(row, fields, data) {
    if (!row || !fields || !data || typeof data !== "object") {
        console.error("Invalid parameters passed to updateTableRow");
        return;
    }

    const tds = row.getElementsByTagName("td");
    let tdIndex = 0; // Keep track of which <td> to update

    fields.forEach(field => {
        if (tdIndex >= tds.length) return; // Prevent out-of-bounds errors

        // If field exists in orderContent, get it from orderContent; otherwise, get it from the main object
        const value = data.orderContent?.[field] ?? data[field] ?? null;
        if (value !== null) tds[tdIndex].textContent = value;
        tdIndex++;
    });
}
//#endregion TABLE ROWS ---------------------------------------------

export { regExpCalls, setupPhoneInput, setupDropdown, handleTableRow }