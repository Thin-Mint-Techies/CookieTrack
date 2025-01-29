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