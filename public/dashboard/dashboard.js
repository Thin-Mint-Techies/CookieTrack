//Set the welcome greeting with users name
document.addEventListener("authStateReady", (event) => {
    const user = event.detail;
    if (user) {
        let welcome = document.getElementById("welcome-greeting");
        const [fName, lName] = user.displayName ? user.displayName.split(" ") : ["", ""];
        
        welcome.textContent = `Welcome back, ${fName}`;
    }
});