import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref as ref_db, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAq0uKOOdjO-UDVX80oZ0TFkRH6aUf941s",
    authDomain: "cookietrack-hub.firebaseapp.com",
    databaseURL: "https://cookietrack-hub-default-rtdb.firebaseio.com",
    projectId: "cookietrack-hub",
    storageBucket: "cookietrack-hub.firebasestorage.app",
    messagingSenderId: "1030404578063",
    appId: "1:1030404578063:web:ebacdf6bf6921b9d72fc7a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

onAuthStateChanged(auth, (user) => {
    //If logged in and on login page,head to dashboard
    if (user && window.location.href == "../login/sign-in.html") {
        //window.location.href = "../dashboard/dashboard.html"
    }
});

//Sign up variables
const createFName = document.getElementById("create-fname");
const createLName = document.getElementById("create-lname");
const createEmail = document.getElementById("create-email");
const createPassword = document.getElementById("create-password");
const confirmPassword = document.getElementById("confirm-password");
const acceptTerms = document.getElementById("accept-terms");
const createAccount = document.getElementById("create-account");

createAccount.addEventListener('click', () => {
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

    createUserWithEmailAndPassword(auth, createEmail.value.trim(), createPassword.value.trim())
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;

            //Upload user to database
            set(ref_db(database, 'Users/' + user.uid), {
                FirstName: createFName.value.trim(),
                LastName: createLName.value.trim(),
                Email: createEmail.value.trim(),
            }).then(() => {
                //Successfully uploaded, head to dashboard
                window.location.href = "../dashboard/dashboard.html"
            });
        })
        .catch((error) => {
            showToast(error.code, error.message + ". Please try again", STATUS_COLOR.RED, true, 10);
        });
}