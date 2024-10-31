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
    //If logged in head to dashboard
    if (user) {
        window.location.href = "../dashboard/dashboard.html"
    }
});

//Sign up variables
const createName = document.getElementById("create-name");
const createEmail = document.getElementById("create-email");
const createPassword = document.getElementById("create-password");
const confirmPassword = document.getElementById("confirm-password");
const acceptTerms = document.getElementById("accept-terms");
const createAccount = document.getElementById("create-account");

createAccount.addEventListener('click', () => {
    createUserAccount();
});

function createUserAccount() {
    const nameRegex = new RegExp(/^[a-zA-z]+ [a-zA-z]+$/gm, "gm");
    const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm, "gm");
    const passRegex = new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/gm, "gm");

    const nameResult = nameRegex.test(createName.value);
    const emailResult = emailRegex.test(createEmail.value);
    const passResult = passRegex.test(createPassword.value);
    const confPass = (createPassword.value === confirmPassword.value);
    
    //Check if results are good
    if (!nameResult) {
        showToast("Invalid Name", "Please make sure you have entered your first and last name.", STATUS_COLOR.RED, true, 5);
        return;
    }

    if (!emailResult) {
        showToast("Invalid Email", "Please make sure you have entered your email and it is correct.");
    }

    if (!passResult) {
        showToast("Invalid Passowrd", "Please make sure you have entered a valid password.");
    }

    if (!confPass) {
        showToast("Passowrds Don't Match", "Please make sure password and confirm password match.");
    }
    return;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
}