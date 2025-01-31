document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('tr .show-row').forEach((btn) => {
        btn.addEventListener('click', () => {
            let arrow = btn.querySelector('i');
            let hiddenRow = btn.parentElement.nextElementSibling;
            
            if (arrow.classList.contains('fa-caret-down')) {
                hiddenRow.classList.remove('hidden');
                arrow.className = 'fa-solid fa-caret-up text-xl';
            } else {
                hiddenRow.classList.add('hidden');
                arrow.className = 'fa-solid fa-caret-down text-xl';
            }
        });
    });
});