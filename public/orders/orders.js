let uploadFilesBtn = document.getElementById('upload-files');
let uploadFilesForm = document.getElementById('upload-files-form');
let uploadFilesInput = document.getElementById('upload-files-input');
let uploadFilesProgList = document.getElementById('upload-files-prog-list');
let uploadFilesCancel = document.getElementById('upload-files-cancel');
let uploadFilesSubmit = document.getElementById('upload-files-submit');
let uploadFilesClose = document.getElementById('upload-files-close');
let uploadedFiles = [];
let uploadProgress = {}; //Track progress per file

uploadFilesBtn.addEventListener('click', () => {
    uploadFilesForm.classList.remove('hidden');
    uploadFilesForm.classList.add('flex');
});

uploadFilesClose.addEventListener('click', () => {
    uploadFilesForm.classList.remove('flex');
    uploadFilesForm.classList.add('hidden');
    uploadedFiles = [];
    uploadProgress = {};
    uploadFilesInput.value = "";
    uploadFilesSubmit.disabled = true;
    renderFileProgress();
});

uploadFilesCancel.addEventListener('click', () => {
    uploadFilesForm.classList.remove('flex');
    uploadFilesForm.classList.add('hidden');
    uploadedFiles = [];
    uploadProgress = {};
    uploadFilesInput.value = "";
    uploadFilesSubmit.disabled = true;
    renderFileProgress();
});

uploadFilesSubmit.addEventListener("click", () => {
    if (uploadFilesSubmit.textContent === "Submit") {
        if (uploadedFiles.length > 0) {
            uploadFilesSubmit.disabled = true;
            uploadedFiles.forEach((file, index) => uploadFiles(file, index));
        }
    } else if (uploadFilesSubmit.textContent === "Done") {
        uploadFilesClose.click();
    }
});

uploadFilesInput.addEventListener('change', (event) => {
    uploadedFiles = [...uploadedFiles, ...Array.from(event.target.files)];
    uploadProgress = {};
    uploadedFiles.forEach((file, index) => (uploadProgress[index] = 0));
    renderFileProgress();
    uploadFilesSubmit.textContent = "Submit";
    uploadFilesSubmit.disabled = uploadedFiles.length === 0;
    uploadFilesCancel.style.display = "";
});

function renderFileProgress() {
    uploadFilesProgList.innerHTML = "";
    uploadedFiles.forEach((file, index) => {
        const fileElem = document.createElement("div");
        fileElem.className = "flex flex-col bg-gray-50 p-4 rounded-lg";
        fileElem.innerHTML = `
            <div class="flex">
                <p class="text-xs text-black flex-1">
                    <i class="fa-solid fa-file-lines w-5 mr-2 inline-block text-lg"></i>
                    ${file.name} <span class="ml-2">(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </p>
                <i data-index="${index}" class="remove-file fa-solid fa-xmark text-xl text-black hover:text-black-light shrink-0 w-3 cursor-pointer"></i>
            </div>
            <div class="bg-black rounded-full w-full h-2 my-2">
                <div id="progress-${index}" class="w-0 h-full rounded-full bg-green flex items-center relative">
                    <span class="absolute text-xs right-0 bg-white w-2 h-2 rounded-full"></span>
                </div>
            </div>
            <p id="progress-text-${index}" class="text-xs text-green flex-1">Waiting for submission</p>`;
        uploadFilesProgList.appendChild(fileElem);
    });

    //Event listeners for removing individual files
    document.querySelectorAll(".remove-file").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            uploadedFiles.splice(event.target.dataset.index, 1);
            renderFileProgress();
            uploadFilesSubmit.disabled = uploadedFiles.length === 0;
        })
    });
};

function uploadFiles(file, index) {
    //First remove the option to remove files
    document.querySelectorAll(".remove-file").forEach((btn) => {
        btn.remove();
    });

    let progress = 0;
    const progressElement = document.getElementById(`progress-${index}`);
    const progressText = document.getElementById(`progress-text-${index}`);
    const uploadSpeed = file.size / 10000; // Slower for larger files

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5; // Random increment between 5-15
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            uploadProgress[index] = progress;
            progressText.textContent = "Upload complete!";
            checkUploadsComplete();
        } else {
            progressText.textContent = `${progress}% done`;
        }
        progressElement.style.width = progress + "%";
    }, uploadSpeed);
};

function checkUploadsComplete() {
    const allDone = Object.values(uploadProgress).every((val) => val === 100);
    console.log(allDone);
    console.log(uploadProgress);
    if (allDone) {
        uploadFilesSubmit.disabled = false;
        uploadFilesSubmit.textContent = "Done";
        uploadFilesCancel.style.display = "none";
    }
}