//Mobile hamburger menu ----------------------------------
var toggleOpen = document.getElementById('toggleOpen');
var toggleClose = document.getElementById('toggleClose');
var collapseMenu = document.getElementById('collapseMenu');

function handleClick() {
    if (collapseMenu?.style.display === 'block') {
        collapseMenu.style.display = 'none';
    } else {
        collapseMenu.style.display = 'block';
    }
}

toggleOpen?.addEventListener('click', handleClick);
toggleClose?.addEventListener('click', handleClick);

//Sider nav menu -----------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Select all parent menu items with submenus
    document.querySelectorAll('#sidebar ul > li > div').forEach((menu) => {
        menu.addEventListener('click', () => {
            const subMenu = menu.nextElementSibling;
            if (!subMenu) return;
            const arrowIcon = menu.querySelector('.fa-angle-down');

            // Check if the submenu is currently open
            if (subMenu.classList.contains('max-h-0')) {
                subMenu.classList.remove('max-h-0');
                subMenu.classList.add('max-h-[500px]');
            } else {
                subMenu.classList.remove('max-h-[500px]');
                subMenu.classList.add('max-h-0');
            }

            // Toggle arrow rotation
            arrowIcon.classList.toggle('rotate-0');
            arrowIcon.classList.toggle('-rotate-90');
        });
    });

    let sidebarCloseBtn = document.getElementById('close-sidebar');
    let sidebarOpenBtn = document.getElementById('open-sidebar');
    let sidebarCollapseMenu = document.getElementById('sidebar-collapse-menu');
    let sidebar = document.getElementById('sidebar');
    let shrunkSidebar = document.getElementById('shrunk-sidebar');

    sidebarOpenBtn?.addEventListener('click', () => {
        sidebarCollapseMenu.style.cssText = 'width: 270px; visibility: visible; opacity: 1;';
        sidebar.style.cssText = 'width: 270px;';
        shrunkSidebar.style.cssText = 'width: 0px';
    });

    sidebarCloseBtn?.addEventListener('click', () => {
        sidebarCollapseMenu.style.cssText = 'width: 32px; visibility: hidden; opacity: 0;';
        sidebar.style.cssText = 'width: 32px;';
        shrunkSidebar.style.cssText = 'width: 16px';
    });
});

//Toast notifications ------------------------------------
const STATUS_COLOR = { RED: "#d53d3d", GREEN: "#1a9988" };

window.showToast = function showNotifToast(title, message, statusColor, isTimed, seconds) {
    // Check if toast-holder exists, if not, create it
    let toastHolder = document.getElementById('toast-holder');
    if (!toastHolder) {
        toastHolder = document.createElement('div');
        toastHolder.id = 'toast-holder';
        document.body.appendChild(toastHolder);
    }

    // Create the toast element programmatically
    const toastElem = document.createElement('div');
    toastElem.className = 'toast';
    toastElem.style.setProperty('--toast-status', statusColor);

    const toastContent = document.createElement('div');
    toastContent.className = 'toast-content';

    const toastIcon = document.createElement('i');
    toastIcon.className = 'fa-solid fa-bell bell';

    const toastMessage = document.createElement('div');
    toastMessage.className = 'toast-message';

    const toastTitle = document.createElement('span');
    toastTitle.className = 'toast-title';
    toastTitle.textContent = title;

    const toastText = document.createElement('span');
    toastText.textContent = message;

    const toastClose = document.createElement('i');
    toastClose.className = 'fa-solid fa-xmark close';

    const toastProgress = document.createElement('div');
    toastProgress.className = 'toast-progress';

    // Append elements
    toastMessage.appendChild(toastTitle);
    toastMessage.appendChild(toastText);
    toastContent.appendChild(toastIcon);
    toastContent.appendChild(toastMessage);
    toastElem.appendChild(toastContent);
    toastElem.appendChild(toastClose);
    toastElem.appendChild(toastProgress);

    // Add the new toast into the toast holder
    toastHolder.insertBefore(toastElem, toastHolder.firstChild);

    // Show the toast
    setTimeout(() => {
        toastElem.classList.add('active');
    }, 100);

    // Handle progress bar if isTimed is true
    if (isTimed === true) {
        toastProgress.style.setProperty('--toast-duration', seconds + 's');
        toastProgress.classList.add('active');

        toastProgress.addEventListener("animationend", function () {
            toastElem.classList.remove('active');
            toastProgress.classList.remove('active');
            setTimeout(() => {
                toastElem.remove();
            }, 500);
        });
    }

    // Limit the number of toasts: 2 for mobile, 4 for desktop
    const currToastArr = Array.from(toastHolder.children);
    const maxToasts = window.innerWidth <= 600 ? 2 : 4;
    if (currToastArr.length > maxToasts) {
        for (let i = maxToasts; i < currToastArr.length; i++) {
            currToastArr[i].querySelector('.close').click();
        }
    }

    // Close toast on click of the close button
    toastClose.addEventListener('click', function () {
        toastProgress.classList.remove('active');
        toastElem.classList.remove('active');
        setTimeout(() => {
            toastElem.remove();
        }, 500);
    });
};

//Loader function ----------------------------------------
window.manageLoader = function (shouldShow = false) {
    // Check if loader exists, if not, create it
    let loader = document.getElementById("loader");
    if (!loader) {
        const loaderHTML = `
            <div id="loader" style="display: none;">
                <div class="flex-col gap-4 w-full flex items-center justify-center fixed top-0 bottom-0 bg-white z-[999999]">
                    <div
                        class="w-20 h-20 border-4 border-transparent text-green text-4xl animate-spin flex items-center justify-center border-t-green rounded-full"
                    >
                        <div
                            class="w-16 h-16 border-4 border-transparent text-orange text-2xl animate-spin flex items-center justify-center border-t-orange rounded-full"
                        ></div>
                    </div>
                </div>
            </div>
        `;
        loader = document.createElement("div");
        loader.innerHTML = loaderHTML.trim();
        document.body.appendChild(loader.firstChild);
    }

    // Perform the requested action
    if (shouldShow === true) {
        loader.style.display = "flex";
    } else {
        loader.style.display = "none";
    }
};
