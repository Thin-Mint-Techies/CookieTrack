import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getAuth, onAuthStateChanged, createUserWithEmailAndPassword, sendEmailVerification, setPersistence, browserLocalPersistence, browserSessionPersistence,
    signInWithEmailAndPassword, sendPasswordResetEmail, signOut, GoogleAuthProvider, signInWithRedirect, getRedirectResult, getAdditionalUserInfo
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref as ref_db, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAq0uKOOdjO-UDVX80oZ0TFkRH6aUf941s",
    authDomain: "cookietrack-hub.web.app",
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
const provider = new GoogleAuthProvider();

onAuthStateChanged(auth, (user) => {
    //If logged in and on login page, head to dashboard
    if (user) {
        if (window.location.href.includes("/login/sign-in") && !localStorage.getItem("pendingRedirect")) {
            window.location.href = "../dashboard/dashboard.html";
        }
    } else {
        if (!window.location.href.includes("/login/sign-in") && !window.location.href.includes("/login/sign-up")
            && !window.location.href.includes("/login/forgot-pass")) {
            window.location.href = "../login/sign-in";
        }
    }
});

//Sign in functions ------------------------------------------------
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const rememberMe = document.getElementById("remember-me");
const loginBtn = document.getElementById("login");
const googleLoginBtn = document.getElementById("login-google");
const loader = document.getElementById("loader");

loginBtn?.addEventListener('click', () => {
    loginUserEmail();
});

function loginUserEmail() {
    const email = loginEmail.value;
    const password = loginPassword.value;
    const saveLogin = rememberMe.checked;

    setPersistence(auth, saveLogin ? browserLocalPersistence : browserSessionPersistence)
        .then(() => {
            // If remember me is checked, persistence will be until user signs out
            // If not checked, persistence will be for the current session (tab)
            return signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;

                })
                .catch((error) => {
                    console.log(error.code + ": " + error.message);
                    showToast("Login Failed", "Make sure you have entered your account email and password correctly.", STATUS_COLOR.RED, true, 8);
                });
        })
        .catch((error) => {
            console.log(error.code + ": " + error.message);
            showToast("Persistance Error", "An unexpected error occured. Please login again.", STATUS_COLOR.RED, true, 8);
        });

}

googleLoginBtn?.addEventListener('click', () => {
    // Set flag for redirect 
    localStorage.setItem("pendingRedirect", "true");
    signInWithRedirect(auth, provider);
});

if (localStorage.getItem("pendingRedirect")) {
    loader.style = "";
    getRedirectResult(auth)
        .then((result) => {
            // Remove the redirect flag
            localStorage.removeItem("pendingRedirect");

            // This gives you a Google Access Token. You can use it to access Google APIs.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            // Access additional identity provider data
            const additionalUserInfo = getAdditionalUserInfo(result);
            //const profile = additionalUserInfo?.profile;  // Provider-specific profile info
            const isNewUser = additionalUserInfo?.isNewUser;  // True if first-time login
            console.log("New User: " + isNewUser);

            //Save profile to database if new user, otherwise go to dashboard
            if (isNewUser) {
                // The signed-in user info.
                const user = result.user;
                const email = user.email;
                const displayName = user.displayName;  // Full name (first and last name)
                const [firstName, lastName] = displayName ? displayName.split(" ") : ["", ""];

                //Upload user to database
                set(ref_db(database, 'Users/' + user.uid), {
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                }).then(() => {
                    //Successfully uploaded, head to dashboard
                    window.location.href = "../dashboard/dashboard.html"
                });
            } else {
                //Signed in, head to dashboard
                window.location.href = "../dashboard/dashboard.html"
            }
        }).catch((error) => {
            loader.style.display = "none";
            console.log(error.code + ": " + error.message);
            showToast("Unable to Sign In", "There was an error trying to sign in with your Google account. Please try again.", STATUS_COLOR.RED, true, 10);
        });
}


//Sign out functions ------------------------------------------------
const signoutBtn = document.getElementById("sign-out");

signoutBtn?.addEventListener("click", () => {
    signOutUser();
});

function signOutUser() {
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        showToast(error.code, error.message, STATUS_COLOR.RED, true, 10);
    });
}

//Sign up functions ------------------------------------------------
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
    loader.style = "";

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
            loader.style.display = "none";
            console.log(error.code + ": " + error.message);
            showToast("Account Creation Error", "There was an error while trying to create your account. Please try again.", STATUS_COLOR.RED, true, 10);
        });
}

//Forgot password functions ------------------------------------------------
const forgotPassEmail = document.getElementById("forgot-pass-email");
const resetPasswordBtn = document.getElementById("reset-password");

resetPasswordBtn?.addEventListener("click", () => {
    if (forgotPassEmail.value.trim() == "") {
        showToast("Missing Information", "You must enter a valid email address before you can reset your password.", STATUS_COLOR.RED, true, 8);
        return;
    }

    sendPasswordResetEmail(auth, forgotPassEmail.value.trim()).then(() => {
        showToast("Email Sent", "If your account exists, you should be receiving an email to reset your password.", STATUS_COLOR.GREEN, false);
    }).catch((error) => {
        console.log(error.code + ": " + error.message);
        showToast("Error Sending Email", "There was an error sending an email to your address. Please try again.", STATUS_COLOR.RED, true, 8);
    });
});