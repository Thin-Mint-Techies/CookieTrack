import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js';
import { callApi } from "../utils/apiCall.js";
import { handleSkeletons } from './skeletons.js';
import { imageStorageHandler } from './utils.js';

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

        if (sessionStorage.getItem("userData") === null && localStorage.getItem('creatingAccount') === null) {
            const sidebar = document.getElementById('sidebar');
            const shrunkSidebar = document.getElementById('shrunk-sidebar');
            if (!sidebar && !shrunkSidebar) return;

            try {
                //Show skeletons for the user info on the sidebar
                handleSkeletons.hideNeedSkeletons(sidebar);
                handleSkeletons.hideNeedSkeletons(shrunkSidebar);
                handleSkeletons.sidebarSkeleton(sidebar.querySelector('.need-skeleton').parentElement, false);
                handleSkeletons.sidebarSkeleton(shrunkSidebar.querySelector('.need-skeleton').parentElement, true);

                //Load user information and store it in session storage
                const userData = await callApi(`/user/${user.uid}`);

                //Check if userData has a role param. If so, update their role to new role
                if (userData.role) {
                    await callApi(`/attachRoleAsCustomClaim/${user.uid}`, 'POST', null, false);
                    window.location.reload();
                }

                const userRole = await callApi(`/getRole/${user.uid}`);

                //Check if profile pic exists in local storage
                if (!localStorage.getItem('profilePic')) {
                    //Check if the user has the profilePic in their info then update localStorage
                    if (userData.profilePic) {
                        imageStorageHandler.saveFileUrl('profilePic', userData.profilePic);
                    }
                }

                if (userData && userRole) {
                    sessionStorage.setItem("userData", JSON.stringify(userData));
                    sessionStorage.setItem("userRole", JSON.stringify(userRole));
                }

                //Remove skeletons and update sidebar
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
    //Ensure that the browser supports the service worker API then register it
    if (navigator.serviceWorker) {
        navigator.serviceWorker.register('../service-worker.js').then(reg => {
            console.log('Service Worker registered with scope:', reg.scope);
        }).catch(swErr => console.error(`Service Worker registration failed: ${swErr}}`));
    }

    if (sessionStorage.getItem("userData")) {
        updateSidebarWithUserData();
    }
});

function updateSidebarWithUserData() {
    // Load user info into sidebars
    let navUserName = document.getElementById("nav-username");
    let navUserEmail = document.getElementById("nav-useremail");
    let navUserPhoto = document.getElementById("nav-userphoto");
    let navSmUserPhoto = document.getElementById("nav-sm-userphoto");

    //Get user data from session storage/profile pic from local
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const userProfilePic = localStorage.getItem("profilePic");

    if (navUserName) navUserName.textContent = userData?.name || null;
    if (navUserEmail) navUserEmail.textContent = userData?.email || null;
    if (navUserPhoto) navUserPhoto.src = userProfilePic || "../resources/images/avatar.png";
    if (navSmUserPhoto) navSmUserPhoto.src = userProfilePic || "../resources/images/avatar.png";
}

//Sign out functions ------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
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
            sessionStorage.removeItem('userRole');
            localStorage.removeItem('profilePic');
        }).catch((error) => {
            showToast(error.code, error.message, STATUS_COLOR.RED, true, 10);
        });
    }
});

export { auth, db };