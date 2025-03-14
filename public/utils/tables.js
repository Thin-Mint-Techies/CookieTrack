//Table headers & row data fields
const tableSchemas = {
    orders: {
        headers: [
            "Date Created", "Trooper Name", "Parent Name", "Box Total", "# Adventurefuls", "# Toast-Yays!", "# Lemonades",
            "# Trefoils", "# Thin Mints", "# Peanut Butter Patties", "# Caramel deLites", "# Peanut Butter Sandwich", 
            "# GF Caramel Chocolate Chip", "Pickup Location", "Contact Preference", "Financial Agreement"
        ],
        fields: [
            "dateCreated", "trooperName", "parentName", "boxTotal", "adventurefuls", "toastyays", "lemonades",
            "trefoils", "thinMints", "pbPatties", "caramelDelites", "pbSandwich", "gfChocChip", "pickup",
            "contact", "financialAgreement"
        ]
    },
    completedOrders: {
        headers: [
            "Date Created", "Date Completed", "Trooper Name", "Parent Name", "Box Total", "# Adventurefuls", "# Toast-Yays!", "# Lemonades",
            "# Trefoils", "# Thin Mints", "# Peanut Butter Patties", "# Caramel deLites", "# Peanut Butter Sandwich", 
            "# GF Caramel Chocolate Chip", "Pickup Location", "Contact Preference", "Financial Agreement"
        ],
        fields: [
            "dateCreated", "dateCompleted", "trooperName", "parentName", "boxTotal", "adventurefuls", "toastyays", "lemonades",
            "trefoils", "thinMints", "pbPatties", "caramelDelites", "pbSandwich", "gfChocChip", "pickup",
            "contact", "financialAgreement"
        ]
    },
    inventory: {
        headers: ["Cookie Name", "Boxes In Stock", "Boxes Sold Month"],
        fields: ["cookieName", "boxesInStock", "boxesSoldMonth"]
    },
    inventoryNeed: {
        headers: ["Cookie Name", "Boxes Needed"],
        fields: ["cookieName", "boxesNeeded"]
    },
    troopers: {
        headers: [
            "", "Troop Number", "Trooper Name", "Parent Name", "Troop Leader", "Current Balance", "Boxes Sold", "Age", "Grade", "Shirt/Jacket Size"
        ],
        fields: [
            "troopNumber", "trooperName", "parentName", "troopLeader", "currentBalance", "boxesSold", "age", "grade", "shirtSize"
        ]
    },
    files: {
        headers: ["File Name", "File Size", "Date Uploaded"],
        fields: ["fileName", "fileSize", "dateUploaded"]
    }
};

//#region TABLE CREATION --------------------------------------------
const handleTableCreation = {
    currentOrder: (parent) => createCurrentOrdersTable(parent),
    completedOrder: (parent) => createCompletedOrdersTable(parent),
    yourInventory: (parent) => createYourInventoryTable(parent),
    troopInventory: (parent) => createTroopInventoryTable(parent),
    needInventory: (parent) => createNeedInventoryTable(parent),
    yourTrooper: (parent) => createYourTrooperTable(parent),
    allTrooper: (parent) => createAllTrooperTable(parent),
    yourDocuments: (parent) => createYourDocumentsTable(parent),
}

const tableFilters = {
    search: (searchId) => {
        return `
            <div class="flex relative w-full">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <i class="fa-solid fa-magnifying-glass w-4 h-4 text-black"></i>
                </div>
                <input type="search" id="${searchId}-search" placeholder="Search by trooper or parent names"
                    class="block w-full p-2 ps-10 text-sm text-black border-2 border-gray rounded-default bg-white focus:ring-green focus:border-green outline-none"
                />
            </div>
        `;
    },
    dates: (startId, endId) => {
        return `
            <div class="flex items-center gap-4 max-sm:w-full sm:col-span-2 xl:col-span-1 xl:order-2">
                <div class="relative flex-1 min-w-0">
                    <label for="${startId}-datestart"
                        class="absolute text-sm text-green left-1 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2">
                        Start date
                    </label>
                    <input id="${startId}-datestart" name="start" type="date"
                        class="block w-full min-w-0 p-2.5 bg-white border-2 border-gray text-black text-sm rounded-default focus:ring-green focus:border-green outline-none appearance-none">
                </div>
                <span class="text-black">to</span>
                <div class="relative flex-1 min-w-0">
                    <label for="${endId}-dateend"
                        class="absolute text-sm text-green left-1 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2">
                        End date
                    </label>
                    <input id="${endId}-dateend" name="end" type="date"
                        class="block w-full min-w-0 p-2.5 bg-white border-2 border-gray text-black text-sm rounded-default focus:ring-green focus:border-green outline-none appearance-none">
                </div>
            </div>
        `;
    },
    clear: (clearId) => {
        return `
            <div class="flex relative sm:w-auto max-sm:order-3 xl:justify-self-auto xl:order-3">
                <button id="${clearId}-clear-filters" type="button"
                    class="w-full shadow-default py-1 px-2 text-lg tracking-wide rounded-default text-white bg-blue hover:bg-blue-light accent-gray">
                    Clear Filters
                </button>
            </div>
        `;
    }
}

function createTable(parent, title, icon, filters, fields, button) {
    let filtersClass = (filters !== null && filters.length > 1) ? "grid grid-cols-1 sm:grid-cols-[auto_auto] xl:grid-cols-[40%_auto_auto] gap-4" : "flex";
    let filtersContainer = "", buttonContainer = "";
    
    if (filters !== null) {
        filtersContainer = `
            <div id="${title.replace(' ', '-').toLowerCase() + "-filters"}" class="${filtersClass} mb-4 items-center">
                ${filters.map(filter => filter).join('')}
            </div>
        `;
    }

    if (button) {
        buttonContainer = `
            <div class="flex justify-end mt-2">
                <button id="${button.id}" type="button" class="w-auto shadow-default py-3 px-4 text-xl tracking-wide rounded-default text-white bg-orange hover:bg-orange-light accent-green">
                    <i class="fa-solid fa-${button.icon}"></i> ${button.title}
                </button>
            </div>
        `;
    }

    const container = document.createElement('div');
    container.className = "need-skeleton mt-12 mb-6 px-2";
    container.innerHTML = `
        <div class="bg-white py-6 px-4 max-w-7xl relative shadow-default mx-auto rounded-default">
            <h2 class="text-green text-4xl max-sm:text-2xl font-extrabold mb-8">
                <i class="fa-solid fa-${icon}"></i> ${title}
            </h2>
            ${filtersContainer}
            <div class="overflow-auto pb-4 max-h-96">
                <table class="min-w-full border-separate border-spacing-0 border-4 border-green rounded-default">
                    <thead class="bg-green whitespace-nowrap sticky top-0">
                        <tr class="text-left text-lg text-white [&_th]:p-4 [&_th]:font-normal">
                            ${fields.map(field => `<th>${field}</th>`).join('')}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="${title.replaceAll(' ', '-').toLowerCase() + "-tbody"}" class="whitespace-nowrap"></tbody>
                </table>
            </div>
            ${buttonContainer}
        </div>
    `;
    parent.appendChild(container);
}

function createCurrentOrdersTable(parent) {
    const title = "Current Orders";
    const icon = "hourglass-half"
    const filterIds = "current-orders";
    const filters = [
        tableFilters.search(filterIds),
        tableFilters.clear(filterIds),
        tableFilters.dates(filterIds, filterIds)
    ];
    const button = {
        id: "add-order",
        title: "Add New Order",
        icon: "cart-plus"
    }
    createTable(parent, title, icon, filters, tableSchemas.orders.headers, button);
}

function createCompletedOrdersTable(parent) {
    const title = "Completed Orders";
    const icon = "clipboard-check"
    const filterIds = "completed-orders";
    const filters = [
        tableFilters.search(filterIds),
        tableFilters.clear(filterIds),
        tableFilters.dates(filterIds, filterIds)
    ];
    createTable(parent, title, icon, filters, tableSchemas.completedOrders.headers, null);
}

function createYourInventoryTable(parent) {
    const title = "Your Inventory";
    const icon = "box"
    const button = {
        id: "add-your-cookies",
        title: "Add New Cookies",
        icon: "cookie-bite"
    }
    createTable(parent, title, icon, null, tableSchemas.inventory.headers, button);
}

function createTroopInventoryTable(parent) {
    const title = "Troop Inventory";
    const icon = "boxes-stacked"
    const button = {
        id: "add-troop-cookies",
        title: "Add New Cookies",
        icon: "cookie-bite"
    }
    createTable(parent, title, icon, null, tableSchemas.inventory.headers, button);
}

function createNeedInventoryTable(parent) {
    const title = "Need To Order";
    const icon = "truck-ramp-box"
    createTable(parent, title, icon, null, tableSchemas.inventoryNeed.headers);
}

function createYourTrooperTable(parent) {
    const title = "Your Troopers";
    const icon = "user"
    const button = {
        id: "add-trooper",
        title: "Add Trooper",
        icon: "user-plus"
    }
    createTable(parent, title, icon, null, tableSchemas.troopers.headers, button);
}

function createAllTrooperTable(parent) {
    const title = "All Troopers";
    const icon = "users"
    const filters = [tableFilters.search("all-troopers")];
    const button = {
        id: "add-trooper",
        title: "Add Trooper",
        icon: "user-plus"
    }
    createTable(parent, title, icon, filters, tableSchemas.troopers.headers, button);
}

function createYourDocumentsTable(parent) {
    const title = "Your Documents";
    const icon = "folder-open"
    const button = {
        id: "upload-files",
        title: "Upload Files",
        icon: "cloud-arrow-up"
    }
    createTable(parent, title, icon, null, tableSchemas.files.headers, button);
}

//#endregion TABLE CREATION -----------------------------------------

//#region TABLE FILTERS ---------------------------------------------
const searchTableRows = {
    currentOrders: (searchId, startDateId, endDateId, clearId) => setupTableFilters(searchId, startDateId, endDateId, clearId, searchCurrentOrderRows),
    completedOrders: (searchId, startDateId, endDateId, clearId) => setupTableFilters(searchId, startDateId, endDateId, clearId, searchCompletedOrderRows),
    allTroopers: (searchId) => setupTableFilters(searchId, null, null, null, searchAllTrooperRows),
}

function setupTableFilters(searchId, startDateId, endDateId, clearId, searchAction) {
    const search = document.getElementById(searchId);
    const startDate = document.getElementById(startDateId);
    const endDate = document.getElementById(endDateId);
    const clear = document.getElementById(clearId);

    function searchFunction() {
        const searchData = search?.value.trim();
        const startDateData = startDate?.value;
        const endDateData = endDate?.value;

        searchAction(searchData, startDateData, endDateData);
    }

    //Setup event listeners for inputs and clear button
    search?.addEventListener('input', searchFunction, false);
    startDate?.addEventListener('input', searchFunction, false);
    endDate?.addEventListener('input', searchFunction, false);
    clear?.addEventListener('click', () => {
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

function searchAllTrooperRows(searchName) {
    const tbody = document.getElementById(`all-troopers-tbody`);
    const unfilteredRows = tbody.getElementsByTagName("tr");
    const rows = Array.from(unfilteredRows).filter(row => !row.classList.contains("hidden-row"));

    Array.from(rows).forEach(row => {
        const cells = row.getElementsByTagName("td");

        //Get values from specific <td> cells
        const trooperNameText = cells[2].textContent.trim();
        const parentNameText = cells[3].textContent.trim();

        //Check if the name matches (case-insensitive)
        const nameSearchActive = searchName.trim() !== "";
        const trooperNameMatch = nameSearchActive && trooperNameText.toLowerCase().includes(searchName.toLowerCase());
        const parentNameMatch = nameSearchActive && parentNameText.toLowerCase().includes(searchName.toLowerCase());
        const nameMatches = nameSearchActive ? (trooperNameMatch || parentNameMatch) : true;

        //Show or hide the row based on conditions
        if (nameMatches) {
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
    yourInventory: (data, editAction, deleteAction) => addInventoryRow(data, "your-inventory", editAction, deleteAction),
    troopInventory: (data, editAction, deleteAction) => addInventoryRow(data, "troop-inventory", editAction, deleteAction),
    needInventory: (data, editAction, deleteAction) => addInventoryRow(data, "need-to-order", editAction, deleteAction),
    yourTrooper: (data, editAction, deleteAction) => addTrooperRow(data, "your", editAction, deleteAction),
    allTrooper: (data, editAction, deleteAction) => addTrooperRow(data, "all", editAction, deleteAction),
    yourDocuments: (data, downloadAction, deleteAction) => addFileRow(data, downloadAction, deleteAction),
    updateOrderRow: (row, data) => editRowData(row, tableSchemas.orders.fields, data),
    updateInventoryRow: (row, data) => editRowData(row, tableSchemas.inventory.fields, data),
    updateTrooperRow: (row, data) => editRowData(row, tableSchemas.troopers.fields, data)
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
    const fields = isCurrentOrder ? tableSchemas.orders.fields : tableSchemas.completedOrders.fields;
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
    const fields = tbodyId === "need-to-order" ? tableSchemas.inventoryNeed.fields : tableSchemas.inventory.fields;
    const tbody = document.getElementById(`${tbodyId}-tbody`);
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

    setupRowFields(tr, true, tableSchemas.troopers.fields, data, buttons);
    tbody.appendChild(tr);

    //Now add a hidden row after the main row
    let hiddenTr = document.createElement("tr");
    hiddenTr.className = "hidden-row hidden";

    let hiddenTd = document.createElement("td");
    hiddenTd.className = "pl-12 text-sm";
    hiddenTd.colSpan = tableSchemas.troopers.fields.length + 2;

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

    setupRowFields(tr, false, tableSchemas.files.fields, data, buttons);
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

export { handleTableCreation, searchTableRows, handleTableRow };