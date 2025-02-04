import { auth, db } from "../utils/auth.js";
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js';
import { manageLoader } from "../utils/loader.js";
import { showToast, STATUS_COLOR } from "../utils/toasts.js";

const createFName = document.getElementById("create-fname");
const createLName = document.getElementById("create-lname");
const createEmail = document.getElementById("create-email");
const createPassword = document.getElementById("create-password");
const confirmPassword = document.getElementById("confirm-password");
const acceptTerms = document.getElementById("accept-terms");
const createAccount = document.getElementById("create-account");

createAccount?.addEventListener('click', () => {
    createUserAccount();
});

function createUserAccount() {
    const nameRegex = new RegExp(/^[a-zA-Z]+[a-zA-Z-]*$/);
    const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm, "gm");
    const passRegex = new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/gm, "gm");

    const fNameResult = nameRegex.test(createFName.value.trim());
    const lNameResult = nameRegex.test(createLName.value.trim());
    const emailResult = emailRegex.test(createEmail.value.trim());
    const passResult = passRegex.test(createPassword.value.trim());
    const confPass = (createPassword.value.trim() === confirmPassword.value.trim());
    const termsResult = acceptTerms.checked;

    //Check if results are good
    if (!fNameResult) {
        showToast("Missing Information", "Please make sure you have correctly entered your first name.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (!lNameResult) {
        showToast("Missing Information", "Please make sure you have correctly entered your last name.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (!emailResult) {
        showToast("Invalid Email", "Please make sure you have entered a valid email.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (!passResult) {
        showToast("Invalid Password", "Password must be at least 6 characters and contain 1 special character, 1 uppercase, and 1 number.", STATUS_COLOR.RED, true, 8);
        return;
    }

    if (!confPass) {
        showToast("Passwords Do Not Match", "Please make sure password and confirm password match.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (!termsResult) {
        showToast("Accept Terms", "You must read and accept our terms of service before continuing.", STATUS_COLOR.RED, true, 5);
        return;
    }

    // Show loader then try to create account
    manageLoader(true);
    localStorage.setItem("creatingAccount", true);
    createUserWithEmailAndPassword(auth, createEmail.value.trim(), createPassword.value.trim())
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;

            // Upload user to database
            setDoc(doc(db, "users", user.uid), {
                name: createFName.value.trim() + " " + createLName.value.trim(),
                email: createEmail.value.trim(),
                role: "parent"
            }).then(() => {
                // Successful upload, head to dashboard
                localStorage.removeItem("creatingAccount");
                window.location.href = "../dashboard/dashboard.html";
            }).catch((error) => {
                manageLoader(false);
                console.log(error.code + ": " + error.message);
                showToast("Account Creation Error", "There was an error while trying to create your account. Please try again.", STATUS_COLOR.RED, true, 10);
            });
        })
        .catch((error) => {
            manageLoader(false);
            localStorage.removeItem("creatingAccount");
            console.log(error.code + ": " + error.message);
            showToast("Account Creation Error", "There was an error while trying to create your account. Please try again.", STATUS_COLOR.RED, true, 10);
        });
}