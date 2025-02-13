//Get and update the current months predicted best seller
const monthlyCookie = {
    0: { name: "Adventurefuls", image: "/public/resources/images/adventurefuls.jpg" },
    1: { name: "Thin Mints", image: "/public/resources/images/thin-mints.jpg" },
    2: { name: "Peanut Butter Patties", image: "/public/resources/images/pb-patties.png" },
    3: { name: "Trefoils", image: "/public/resources/images/trefoils.jpg" },
};

(function getCurrentMonthCookie() {
    const currentMonth = new Date().getMonth();
    let currentCookie =  monthlyCookie[currentMonth] || { name: "Unknown", image: "/public/resources/images/cookie_icon.png" };

    let monthlyCookieName = document.getElementById("monthly-cookie-name");
    let monthlyCookieImg = document.getElementById("monthly-cookie-img");

    monthlyCookieName.textContent = currentCookie.name;
    monthlyCookieImg.src = currentCookie.image;
})();

//Set the welcome greeting with users name
document.addEventListener("authStateReady", (event) => {
    const user = event.detail;
    if (user) {
        let welcome = document.getElementById("welcome-greeting");
        const [fName, lName] = user.displayName ? user.displayName.split(" ") : ["", ""];
        
        welcome.textContent = `Welcome back, ${fName}`;
    }
});