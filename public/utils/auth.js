import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js';
import { callApi } from "../utils/apiCall.js";
import { handleSkeletons } from './skeletons.js';

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

const allowedNotLoggedInURLs = [
    "/login/sign-in",
    "/login/sign-up",
    "/login/forgot-pass",
    "/login/terms"
]

onAuthStateChanged(auth, async (user) => {
    //If logged in and on login page, head to dashboard
    if (user) {
        if (window.location.href.includes("/login/sign-in") && !localStorage.getItem("creatingAccount")) {
            window.location.href = "../dashboard/dashboard.html";
        }

        if (sessionStorage.getItem("userData") === null) {
            console.log("First load");
            const sidebar = document.getElementById('sidebar');
            const shrunkSidebar = document.getElementById('shrunk-sidebar');

            try {
                handleSkeletons.hideNeedSkeletons(sidebar);
                handleSkeletons.hideNeedSkeletons(shrunkSidebar);
                handleSkeletons.sidebarSkeleton(sidebar.querySelector('.need-skeleton').parentElement, false);
                handleSkeletons.sidebarSkeleton(shrunkSidebar.querySelector('.need-skeleton').parentElement, true);
                const userData = await callApi(`/user/${user.uid}`);
                if (userData) sessionStorage.setItem("userData", JSON.stringify(userData));
                handleSkeletons.removeSkeletons(sidebar);
                handleSkeletons.removeSkeletons(shrunkSidebar);
                updateSidebarWithUserData();
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        }

        //Send out a doc event to trigger other functions when auth is ready
        document.dispatchEvent(new CustomEvent("authStateReady"));
    } else {
        if (!allowedNotLoggedInURLs.some(url => window.location.href.includes(url))) {
            window.location.href = "../login/sign-in.html";
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem("userData")) {
        updateSidebarWithUserData();
    }
});

function updateSidebarWithUserData() {
    // Load user info into sidebars
    let navUserName = document.getElementById("nav-username");
    let navUserEmail = document.getElementById("nav-useremail");
    /* let navUserPhoto = document.getElementById("nav-userphoto");
    let navSmUserPhoto = document.getElementById("nav-sm-userphoto"); */

    //Get user data from session storage
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (navUserName) navUserName.textContent = userData?.name || null;
    if (navUserEmail) navUserEmail.textContent = userData?.email || null;
    /* if (navUserPhoto) navUserPhoto.src = user.photoUrl;
    if (navSmUserPhoto) navSmUserPhoto.src = user.photoUrl; */
}

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
        sessionStorage.removeItem('userData');
    }).catch((error) => {
        showToast(error.code, error.message, STATUS_COLOR.RED, true, 10);
    });
}

export { auth, db };