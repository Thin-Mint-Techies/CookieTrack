import { callApi } from "../utils/apiCall.js";
import { handleSkeletons } from "../utils/skeletons.js";
import { handleTableCreation } from "../utils/tables.js";

//#region CREATE TABLES/LOAD DATA -----------------------------------
let userData;
let welcome = document.getElementById("welcome-greeting");
let welcomeParent = welcome.parentElement;

//First show skeleton loaders as dashboard info is waiting to be pulled
const mainContent = document.getElementsByClassName('main-content')[0];
handleSkeletons.hideNeedSkeletons(welcomeParent.parentElement);
handleSkeletons.greetingSkeleton(welcomeParent.parentElement);
handleSkeletons.monthlySkeleton(mainContent);
handleSkeletons.statsSkeleton(mainContent, 2);

//Wait for auth setup then pull user info and dashboard
document.addEventListener("authStateReady", async () => {
    userData = JSON.parse(sessionStorage.getItem("userData"));

    //Create monthly cookie and stats, load user info
    if (userData.id) {
        const [fName, lName] = userData.name ? userData.name.split(" ") : ["", ""];
        welcome.textContent = `Welcome back, ${fName}`;

        const statData = {
            troop: {
                id: "Troop",
                stats: [
                    {
                        title: "Revenue this Month",
                        stat: "$380"
                    },
                    {
                        title: "Boxes Sold this Month",
                        stat: "400+"
                    },
                    {
                        title: "Current Inventory",
                        stat: "200 boxes"
                    },
                    {
                        title: "Hottest Seller",
                        stat: "Thin Mints"
                    }
                ]
            },
            your: {
                id: "Your",
                stats: [
                    {
                        title: "Revenue this Month",
                        stat: "$100"
                    },
                    {
                        title: "Boxes Sold this Month",
                        stat: "50+"
                    },
                    {
                        title: "Current Inventory",
                        stat: "40 boxes"
                    },
                    {
                        title: "Hottest Seller",
                        stat: "Adventurefuls"
                    }
                ]
            }
        }

        handleTableCreation.monthlyCookie(mainContent, getCurrentMonthCookie());
        handleTableCreation.statBox(mainContent, statData.troop);
        handleTableCreation.statBox(mainContent, statData.your);
    } else {
        showToast("Error Loading Data", "There was an error loading user data. Please refresh the page to try again.", STATUS_COLOR.RED, false);
        return;
    }

    //Remove the skeletons
    handleSkeletons.removeSkeletons(mainContent);
});

function getCurrentMonthCookie() {
    const monthlyCookie = {
        0: { name: "Adventurefuls", image: "/public/resources/images/adventurefuls.jpg" },
        1: { name: "Thin Mints", image: "/public/resources/images/thin-mints.jpg" },
        2: { name: "Peanut Butter Patties", image: "/public/resources/images/pb-patties.png" },
        3: { name: "Trefoils", image: "/public/resources/images/trefoils.jpg" },
    };

    const currentMonth = new Date().getMonth();
    return monthlyCookie[currentMonth] || { name: "Unknown", image: "/public/resources/images/cookie_icon.png" };
}
//#endregion CREATE TABLES/LOAD DATA --------------------------------