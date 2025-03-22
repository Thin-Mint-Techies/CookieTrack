import { auth } from "../utils/auth.js";
import { setupPhoneInput } from "../utils/utils.js";

//Input variables
let userFName = document.getElementById("user-fname");
let userLName = document.getElementById("user-lname");
let userEmail = document.getElementById("user-email");
let userPhone = document.getElementById("user-phone");
let userPhoto = document.getElementById("user-photo");
let darkMode = document.getElementById("dark-mode");
let emailPref = document.getElementById("email-pref");

setupPhoneInput(userPhone);

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

//Load the toggle states for settings
if (localStorage.getItem("theme") === "dark" || (!(localStorage.getItem("theme")) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    darkMode.checked = true;
} else {
    darkMode.checked = false;
}

darkMode.addEventListener('change', () => {
    if (darkMode.checked) {
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.add("dark");
    } else {
        localStorage.setItem("theme", "light");
        document.documentElement.classList.remove("dark");
    } 
});