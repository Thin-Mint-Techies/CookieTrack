import { auth } from "../utils/auth.js";

//Load user info into input fields when auth is ready
document.addEventListener("authStateReady", (event) => {
    const user = event.detail;
    if (user) {
        let userFName = document.getElementById("user-fname");
        let userLName = document.getElementById("user-lname");
        let userEmail = document.getElementById("user-email");
        let userPhoto = document.getElementById("user-photo");
        const [fName, lName] = user.displayName ? user.displayName.split(" ") : ["", ""];
        
        userFName.value = fName;
        userLName.value = lName;
        userEmail.value = user.email;
        //userPhoto.src = user.photoUrl;
    }
});
