let uploadFilesBtn = document.getElementById('upload-files');
let uploadFilesForm = document.getElementById('upload-files-form');
let uploadFilesClose = document.getElementById('upload-files-close');

uploadFilesBtn.addEventListener('click', () => {
    uploadFilesForm.classList.remove('hidden');
    uploadFilesForm.classList.add('flex');
});

uploadFilesClose.addEventListener('click', () => {
    uploadFilesForm.classList.remove('flex');
    uploadFilesForm.classList.add('hidden');
});