import { auth, db } from "./auth.js";
import { setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, getRedirectResult, getAdditionalUserInfo } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js';

import { manageLoader } from "../utils/loader.js";
import { showToast, STATUS_COLOR } from "../utils/toasts.js";
const provider = new GoogleAuthProvider();

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const rememberMe = document.getElementById("remember-me");
const loginBtn = document.getElementById("login");
const googleLoginBtn = document.getElementById("login-google");

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
    manageLoader(true);
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
            const isNewUser = additionalUserInfo?.isNewUser;

            //Save profile to database if new user, otherwise go to dashboard
            if (isNewUser) {
                // The signed-in user info.
                const user = result.user;
                const email = user.email;
                const displayName = user.displayName;
                
                setDoc(doc(db, "users", user.uid), {
                    name: displayName,
                    email: email,
                    role: "parent"
                }).then(() => {
                    //Successful upload, head to dashboard
                    window.location.href = "../dashboard/dashboard.html";
                }).catch((error) => {
                    console.log(error.code + ": " + error.message);
                    showToast("Unable to Sign In", "There was an error during account creation. Please try again.", STATUS_COLOR.RED, true, 6);
                });
            } else {
                //Signed in, head to dashboard
                window.location.href = "../dashboard/dashboard.html"
            }
        }).catch((error) => {
            manageLoader(false);
            console.log(error.code + ": " + error.message);
            showToast("Unable to Sign In", "There was an error trying to sign in with your Google account. Please try again.", STATUS_COLOR.RED, true, 10);
        });
}