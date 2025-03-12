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

//#region TABLE FILTERS ---------------------------------------------
const searchTableRows = {
    currentOrders: (searchId, startDateId, endDateId, clearId) => setupTableFilters(searchId, startDateId, endDateId, clearId, searchCurrentOrderRows),
    completedOrders: (searchId, startDateId, endDateId, clearId) => setupTableFilters(searchId, startDateId, endDateId, clearId, searchCompletedOrderRows)
}

function setupTableFilters(searchId, startDateId, endDateId, clearId, searchAction) {
    const search = document.getElementById(searchId);
    const startDate = document.getElementById(startDateId);
    const endDate = document.getElementById(endDateId);
    const clear = document.getElementById(clearId);

    function searchFunction() {
        const searchData = search.value.trim();
        const startDateData = startDate.value;
        const endDateData = endDate.value;

        searchAction(searchData, startDateData, endDateData);
    }

    //Setup event listeners for inputs and clear button
    search.addEventListener('input', searchFunction, false);
    startDate.addEventListener('input', searchFunction, false);
    endDate.addEventListener('input', searchFunction, false);
    clear.addEventListener('click', () => {
        search.value = "";
        startDate.value = "";
        endDate.value = "";
        searchFunction();
    });
}

function parseLocalDate(dateString) {
    if (!dateString) return null;
    const parts = dateString.split("-"); // Expected format: YYYY-MM-DD
    return new Date(parts[0], parts[1] - 1, parts[2]); // Month is zero-based
};

function searchCurrentOrderRows(searchName, startDate, endDate) {
    const tbody = document.getElementById("current-orders-tbody");
    const rows = tbody.getElementsByTagName("tr");

    //Convert string dates to Date objects in LOCAL TIME
    const start = parseLocalDate(startDate);
    let end = parseLocalDate(endDate);

    //Adjust end date to include the full day
    if (end) end.setHours(23, 59, 59, 999);

    Array.from(rows).forEach(row => {
        const cells = row.getElementsByTagName("td");

        //Get values from specific <td> cells
        const dateCreatedText = cells[0].textContent.trim();
        const trooperNameText = cells[1].textContent.trim();
        const parentNameText = cells[2].textContent.trim();

        //Convert table date to a local Date object
        const dateParts = dateCreatedText.split("/"); // Expected format: MM/DD/YYYY
        const dateCreatedDate = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);

        //Check if the name matches (case-insensitive)
        const nameSearchActive = searchName.trim() !== "";
        const trooperNameMatch = nameSearchActive && trooperNameText.toLowerCase().includes(searchName.toLowerCase());
        const parentNameMatch = nameSearchActive && parentNameText.toLowerCase().includes(searchName.toLowerCase());
        const nameMatches = nameSearchActive ? (trooperNameMatch || parentNameMatch) : true;

        //Check if the date falls within the range
        let dateMatches = true;
        if (start && end) {
            dateMatches = dateCreatedDate >= start && dateCreatedDate <= end;
        } else if (start) {
            dateMatches = dateCreatedDate >= start;
        } else if (end) {
            dateMatches = dateCreatedDate <= end;
        }

        //Show or hide the row based on conditions
        if (nameMatches && dateMatches) {
            row.classList.remove("hidden");
        } else {
            row.classList.add("hidden");
        }
    });
}

function searchCompletedOrderRows(searchName, startDate, endDate) {
    const tbody = document.getElementById(`completed-orders-tbody`);
    const rows = tbody.getElementsByTagName("tr");

    //Convert string dates to Date objects in LOCAL TIME
    const start = parseLocalDate(startDate);
    let end = parseLocalDate(endDate);

    //Adjust end date to include the full day
    if (end) end.setHours(23, 59, 59, 999);

    Array.from(rows).forEach(row => {
        const cells = row.getElementsByTagName("td");

        //Get values from specific <td> cells
        const dateCreatedText = cells[0].textContent.trim();
        const dateCompletedText = cells[1].textContent.trim();
        const trooperNameText = cells[2].textContent.trim();
        const parentNameText = cells[3].textContent.trim();

        //Convert table date to a local Date object
        const dateCreatedParts = dateCreatedText.split("/"); //Expected format: MM/DD/YYYY
        const dateCompletedParts = dateCompletedText.split("/") //Expected format: MM/DD/YYYY
        const dateCreatedDate = new Date(dateCreatedParts[2], dateCreatedParts[0] - 1, dateCreatedParts[1]);
        const dateCompletedDate = new Date(dateCompletedParts[2], dateCompletedParts[0] - 1, dateCompletedParts[1]);

        //Check if the name matches (case-insensitive)
        const nameSearchActive = searchName.trim() !== "";
        const trooperNameMatch = nameSearchActive && trooperNameText.toLowerCase().includes(searchName.toLowerCase());
        const parentNameMatch = nameSearchActive && parentNameText.toLowerCase().includes(searchName.toLowerCase());
        const nameMatches = nameSearchActive ? (trooperNameMatch || parentNameMatch) : true;

        //Check if either date falls within the range
        let dateMatches = true;
        if (start && end) {
            dateMatches =
                (dateCreatedDate && dateCreatedDate >= start && dateCreatedDate <= end) ||
                (dateCompletedDate && dateCompletedDate >= start && dateCompletedDate <= end);
        } else if (start) {
            dateMatches =
                (dateCreatedDate && dateCreatedDate >= start) ||
                (dateCompletedDate && dateCompletedDate >= start);
        } else if (end) {
            dateMatches =
                (dateCreatedDate && dateCreatedDate <= end) ||
                (dateCompletedDate && dateCompletedDate <= end);
        }

        //Show or hide the row based on conditions
        if (nameMatches && dateMatches) {
            row.classList.remove("hidden");
        } else {
            row.classList.add("hidden");
        }
    });
}

//#endregion TABLE FILTERS ------------------------------------------

//#region TABLE ROWS ------------------------------------------------
const handleTableRow = {
    currentRowEditing: null,
    currentOrder: (data, editAction, deleteAction, completeAction) => addOrderRow(data, true, editAction, deleteAction, completeAction),
    completedOrder: (data, editAction, deleteAction) => addOrderRow(data, false, editAction, deleteAction, null),
    yourInventory: (data, editAction, deleteAction) => addInventoryRow(data, "your", editAction, deleteAction),
    troopInventory: (data, editAction, deleteAction) => addInventoryRow(data, "troop", editAction, deleteAction),
    needInventory: (data, editAction, deleteAction) => addInventoryRow(data, "need", editAction, deleteAction),
    yourTrooper: (data, editAction, deleteAction) => addTrooperRow(data, "your", editAction, deleteAction),
    allTrooper: (data, editAction, deleteAction) => addTrooperRow(data, "all", editAction, deleteAction),
    yourDocuments: (data, downloadAction, deleteAction) => addFileRow(data, downloadAction, deleteAction),
    updateOrderRow: (row, data) => editRowData(row, rowFields.orders, data),
    updateInventoryRow: (row, data) => editRowData(row, rowFields.inventory, data),
    updateTrooperRow: (row, data) => editRowData(row, rowFields.troopers, data)
}

const orders = [
    "dateCreated", "trooperName", "parentName", "boxTotal", "adventurefuls", "toastyays", "lemonades",
    "trefoils", "thinMints", "pbPatties", "caramelDelites", "pbSandwich", "gfChocChip", "pickup",
    "contact", "finacialAgreement"
];

const rowFields = {
    orders,
    completedOrders: [
        orders[0], "dateCompleted", ...orders.slice(1)
    ],
    inventory: [
        "cookieName", "boxesInStock", "boxesSoldMonth"
    ],
    inventoryNeed: [
        "cookieName", "boxesNeeded"
    ],
    troopers: [
        "troopNumber", "trooperName", "parentName", "troopLeader", "currentBalance", "boxesSold", "age", "grade", "shirtSize"
    ],
    files: [
        "fileName", "fileSize", "dateUploaded"
    ]
}

function setupRowFields(tr, hasDropdown, fields, data, buttons) {
    if (hasDropdown) {
        //Create the dropdown td
        let arrowTd = document.createElement("td");
        arrowTd.className = "show-row !py-[11px] !pl-[18px] !pr-[6px] w-[10px] cursor-pointer";

        let icon = document.createElement("i");
        icon.className = "fa-solid fa-caret-down text-xl";

        arrowTd.addEventListener('click', () => {
            let arrow = arrowTd.querySelector('i');
            let hiddenRow = arrowTd.parentElement.nextElementSibling;

            if (arrow.classList.contains('fa-caret-down')) {
                hiddenRow.classList.remove('hidden');
                arrow.className = 'fa-solid fa-caret-up text-xl';
            } else {
                hiddenRow.classList.add('hidden');
                arrow.className = 'fa-solid fa-caret-down text-xl';
            }
        });

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

        button.addEventListener('click', (e) => {
            handleTableRow.currentRowEditing = e.target.closest('tr');
            btn.action();
        });

        button.appendChild(icon);
        actionTd.appendChild(button);
    });

    tr.appendChild(actionTd);
}

function addOrderRow(data, isCurrentOrder, editAction, deleteAction, completeAction) {
    const tableName = isCurrentOrder ? "current" : "completed";
    const tbody = document.getElementById(`${tableName}-orders-tbody`);
    const fields = isCurrentOrder ? rowFields.orders : rowFields.completedOrders;
    let tr = document.createElement("tr");
    tr.className = "even:bg-gray text-sm text-black [&_td]:p-4";

    // Button configurations
    let buttons = [
        isCurrentOrder && { title: "Complete", iconClass: "fa-clipboard-check text-green hover:text-green-light", action: completeAction },
        { title: "Edit", iconClass: "fa-pen-to-square text-blue hover:text-blue-light", action: editAction },
        { title: "Delete", iconClass: "fa-trash-can text-red hover:text-red-light", action: deleteAction }
    ].filter(Boolean); // Removes `false` values if `isCurrentOrder` is true

    setupRowFields(tr, false, fields, data, buttons);
    tbody.appendChild(tr);
}

function addInventoryRow(data, tbodyId, editAction, deleteAction) {
    const fields = tbodyId === "need" ? rowFields.inventoryNeed : rowFields.inventory;
    const tbody = document.getElementById(`${tbodyId}-inventory-tbody`);
    let tr = document.createElement("tr");
    tr.className = "even:bg-gray text-sm text-black [&_td]:p-4";

    // Button configurations
    let buttons = [
        { title: "Edit", iconClass: "fa-pen-to-square text-blue hover:text-blue-light", action: editAction },
        { title: "Delete", iconClass: "fa-trash-can text-red hover:text-red-light", action: deleteAction }
    ];

    setupRowFields(tr, false, fields, data, buttons);
    tbody.appendChild(tr);
}

function addTrooperRow(data, tbodyId, editAction, deleteAction) {
    const tbody = document.getElementById(`${tbodyId}-troopers-tbody`);
    let tr = document.createElement("tr");
    tr.className = "[&:nth-child(4n-1)]:bg-gray text-sm text-black [&_td]:p-4";

    // Button configurations
    let buttons = [
        { title: "Edit", iconClass: "fa-pen-to-square text-blue hover:text-blue-light", action: editAction },
        { title: "Delete", iconClass: "fa-trash-can text-red hover:text-red-light", action: deleteAction }
    ];

    setupRowFields(tr, true, rowFields.troopers, data, buttons);
    tbody.appendChild(tr);

    //Now add a hidden row after the main row
    let hiddenTr = document.createElement("tr");
    hiddenTr.className = "hidden-row hidden";

    let hiddenTd = document.createElement("td");
    hiddenTd.className = "pl-12 text-sm";
    hiddenTd.colSpan = rowFields.troopers.length + 2;

    let hiddenDiv = document.createElement("div");
    hiddenDiv.className = "p-4 border-2 border-gray rounded-default";
    hiddenDiv.textContent = "Info about trooper.";

    hiddenTd.appendChild(hiddenDiv);
    hiddenTr.appendChild(hiddenTd);
    tbody.appendChild(hiddenTr);
}

function addFileRow(data, downloadAction, deleteAction) {
    const tbody = document.getElementById("your-documents-tbody");
    let tr = document.createElement("tr");
    tr.className = "even:bg-gray text-sm text-black [&_td]:p-4";

    // Button configurations
    let buttons = [
        { title: "Download", iconClass: "fa-cloud-arrow-down text-blue hover:text-blue-light", action: downloadAction },
        { title: "Delete", iconClass: "fa-trash-can text-red hover:text-red-light", action: deleteAction }
    ];

    setupRowFields(tr, false, rowFields.files, data, buttons);
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

export { regExpCalls, setupPhoneInput, setupDropdown, searchTableRows, handleTableRow }