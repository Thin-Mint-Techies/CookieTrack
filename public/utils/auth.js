import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js';
import { callApi } from "../utils/apiCall.js";

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
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
    //Send out a doc event to trigger other functions when auth is ready
    document.dispatchEvent(new CustomEvent("authStateReady", {detail: user}));
    
    //If logged in and on login page, head to dashboard
    if (user) {
        if (window.location.href.includes("/login/sign-in") && !localStorage.getItem("creatingAccount")) {
            window.location.href = "../dashboard/dashboard.html";
        }

        // Load user info into sidebars
        let navUserName = document.getElementById("nav-username");
        let navUserEmail = document.getElementById("nav-useremail");
        let navUserPhoto = document.getElementById("nav-userphoto");
        let navSmUserPhoto = document.getElementById("nav-sm-userphoto");

        if (navUserName) navUserName.textContent = user.displayName;
        if (navUserEmail) navUserEmail.textContent = user.email;
        /* if (navUserPhoto) navUserPhoto.src = user.photoUrl;
        if (navSmUserPhoto) navSmUserPhoto.src = user.photoUrl; */
    } else {
        if (!window.location.href.includes("/login/sign-in") && !window.location.href.includes("/login/sign-up")
            && !window.location.href.includes("/login/forgot-pass") && !window.location.href.includes("/login/terms")) {
            window.location.href = "../login/sign-in.html";
        }
    }
});

/* document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (e) => {
        if (e.key === '\\') {
            console.log("here");
            let accessToken = null;
            auth.currentUser.getIdToken().then((token) => {
                accessToken = token;
                console.log(accessToken);
                let response = callApi(`/trooper/9SkSYZ8u1TQ2hwqeBAre`, 'GET', accessToken);
                console.log(response);
            });
        }
    });
}); */

//Sign out functions ------------------------------------------------
const navSignOut = document.getElementById("nav-signout");
const navSmSignOut = document.getElementById("nav-sm-signout");

navSignOut?.addEventListener("click", () => {
    signOutUser();
});

navSmSignOut?.addEventListener("click", () => {
    signOutUser();
});

function signOutUser() {
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        showToast(error.code, error.message, STATUS_COLOR.RED, true, 10);
    });
}

export { auth, db };