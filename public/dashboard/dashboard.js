import { callApi } from "../utils/apiCall.js";
import { handleSkeletons } from "../utils/skeletons.js";

//Show skeleton loaders on page load
const monthlyCookieDiv = document.getElementById("monthly-cookie");
const mainContent = monthlyCookieDiv.parentElement;

handleSkeletons.hideNeedSkeletons(mainContent);
handleSkeletons.monthlySkeleton(mainContent);
handleSkeletons.statsSkeleton(mainContent, 2);

setTimeout(() => {
    handleSkeletons.removeSkeletons(mainContent);
}, 2000); 

//Get and update the current months predicted best seller
const monthlyCookie = {
    0: { name: "Adventurefuls", image: "/public/resources/images/adventurefuls.jpg" },
    1: { name: "Thin Mints", image: "/public/resources/images/thin-mints.jpg" },
    2: { name: "Peanut Butter Patties", image: "/public/resources/images/pb-patties.png" },
    3: { name: "Trefoils", image: "/public/resources/images/trefoils.jpg" },
};

(function getCurrentMonthCookie() {
    const currentMonth = new Date().getMonth();
    let currentCookie = monthlyCookie[currentMonth] || { name: "Unknown", image: "/public/resources/images/cookie_icon.png" };

    let monthlyCookieName = document.getElementById("monthly-cookie-name");
    let monthlyCookieImg = document.getElementById("monthly-cookie-img");

    monthlyCookieName.textContent = currentCookie.name;
    monthlyCookieImg.src = currentCookie.image;
})();

//Set the welcome greeting with users name
let welcome = document.getElementById("welcome-greeting");
let welcomeParent = welcome.parentElement;

if (sessionStorage.getItem("userData")) {
    const userData = JSON.parse(sessionStorage.getItem("userData"));

    const [fName, lName] = userData.name ? userData.name.split(" ") : ["", ""];
    welcome.textContent = `Welcome back, ${fName}`;
} else {
    handleSkeletons.hideNeedSkeletons(welcomeParent.parentElement);
    handleSkeletons.greetingSkeleton(welcomeParent.parentElement);
    document.addEventListener("authStateReady", () => {
        const userData = JSON.parse(sessionStorage.getItem("userData"));

        if (userData) {
            const [fName, lName] = userData.name ? userData.name.split(" ") : ["", ""];
            welcome.textContent = `Welcome back, ${fName}`;
            handleSkeletons.removeSkeletons(welcomeParent.parentElement);
        }
    });
}

/* document.addEventListener("keydown", (e) => {
    if (e.key === "c") {
        const data = {
            name: "Brandon",
            email: "test@gmail.com",
            role: "parent",
            password: "123456"
        }
        console.log(callApi('/user', 'POST', data));
    }
}); */