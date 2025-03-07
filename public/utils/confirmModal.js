export function createConfirmModal(confirmAction) {
    return () => {
        const modal = document.createElement('div');
        modal.id = 'confirm-modal';
        modal.className = 'flex fixed inset-0 p-4 flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-black-overlay shadow-default overflow-auto';

        modal.innerHTML = `
        <form class="w-full max-w-xl bg-white shadow-default rounded-default p-6 relative">
            <div class="flex items-center pb-3 border-b border-gray">
                <div class="flex-1">
                    <h3 id="confirm-modal-title" class="text-red text-xl font-bold">Confirm Deletion</h3>
                </div>
                <i id="confirm-modal-close" class="fa-solid fa-xmark text-xl text-black hover:text-black-light shrink-0 ml-2 w-3 cursor-pointer"></i>
            </div>
            <div class="flex flex-col gap-4 mt-6 text-center">
                <i class="fa-solid fa-trash-can text-red text-4xl"></i>
                <p class="text-base text-black">Are you sure you wish to delete this item?</p>
            </div>
            <div class="border-t border-gray pt-6 flex justify-between gap-4 mt-6">
                <button id="confirm-modal-cancel" type="button" class="w-full px-4 py-2 rounded-default text-black text-sm border-none tracking-wide bg-white hover:bg-gray accent-green">Cancel</button>
                <button id="confirm-modal-submit" type="button" class="w-full px-4 py-2 rounded-default text-white text-sm border-none tracking-wide bg-red hover:bg-red-light accent-black">Delete</button>
            </div>
        </form>
    `;

        document.body.appendChild(modal);

        // Event listeners for closing the modal
        document.getElementById('confirm-modal-close').addEventListener('click', () => modal.remove());
        document.getElementById('confirm-modal-cancel').addEventListener('click', () => modal.remove());
        document.getElementById('confirm-modal-submit').addEventListener('click', confirmAction);
    }
}
