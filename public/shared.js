//Mobile hamburger menu ----------------------------------
var toggleOpen = document.getElementById('toggleOpen');
var toggleClose = document.getElementById('toggleClose');
var collapseMenu = document.getElementById('collapseMenu');

function handleClick() {
    if (collapseMenu.style.display === 'block') {
        collapseMenu.style.display = 'none';
    } else {
        collapseMenu.style.display = 'block';
    }
}

toggleOpen.addEventListener('click', handleClick);
toggleClose.addEventListener('click', handleClick);

//Toast notifications ------------------------------------
const STATUS_COLOR = { RED: "#d53d3d", GREEN: "#1a9988" };
window.showToast = function showNotifToast(title, message, statusColor, isTimed, seconds) {
    const toastHolder = document.getElementById('toast-holder');
    const toastTemplate = document.getElementById('template-toast');
    const toast = toastTemplate.content.cloneNode(true);
    const toastElem = toast.querySelector('.toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastProgress = toast.querySelector('.toast-progress');
    const toastClose = toast.querySelector('.toast .close');

    //Add the new toast into the toast holder
    toastHolder.insertBefore(toast, toastHolder.firstChild);

    //Change --toast-status css var to statusColor
    toastElem.style.setProperty('--toast-status', statusColor);

    //Update toast title
    toastMessage.children[0].textContent = title;
    toastMessage.children[1].textContent = message;

    //Now show the toast
    setTimeout(() => {
        toastElem.classList.add('active');
    }, 100); //Brief pause to show animation

    //Show the progress bar if isTimed is true
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

    //Check if there are too many toasts: Phone-2, Desktop-4
    const currToastArr = Array.from(toastHolder.children);
    if (window.innerWidth <= 600) { //Mobile
        if (currToastArr.length > 2) {
            for (let i = 2; i < currToastArr.length; i++) {
                currToastArr[i].querySelector('.close').click();
            }
        }
    } else { //Desktop
        if (currToastArr.length > 4) {
            for (let i = 4; i < currToastArr.length; i++) {
                currToastArr[i].querySelector('.close').click();
            }
        }
    }

    toastClose.addEventListener('click', function () {
        toastProgress.classList.remove('active');
        toastElem.classList.remove('active');
        setTimeout(() => {
            toastElem.remove();
        }, 500);
    });
}

//Call function like so:
//showToast("This is the title", "This is the message", STATUS_COLOR.GREEN, true, 5);