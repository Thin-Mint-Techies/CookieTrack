import { auth } from "../utils/auth.js";

//Load user info into input fields
let userFName = document.getElementById("user-fname");
let userLName = document.getElementById("user-lname");
let userEmail = document.getElementById("user-email");
let userPhone = document.getElementById("user-phone");
let userPhoto = document.getElementById("user-photo");

if (sessionStorage.getItem("userData")) {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const [fName, lName] = userData.name ? userData.name.split(" ") : ["", ""];

    userFName.value = fName;
    userLName.value = lName;
    userEmail.value = userData.email;
    userPhone.value = userData.phone;
    //userPhoto.src = userData.photoUrl;
} else {
    document.addEventListener("authStateReady", () => {
        const userData = JSON.parse(sessionStorage.getItem("userData"));

        if (userData) {
            const [fName, lName] = userData.name ? userData.name.split(" ") : ["", ""];

            userFName.value = fName;
            userLName.value = lName;
            userEmail.value = userData.email;
            userPhone.value = userData.phone;
            //userPhoto.src = userData.photoUrl;
        }
    });
}

//Handle account info changes 
userPhone.addEventListener('keydown', disallowNonNumericInput);
userPhone.addEventListener('keyup', formatToPhone);

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

