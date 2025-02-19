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

export { regExpCalls, setupPhoneInput, setupDropdown }