import { handleTableRow } from "../utils/utils.js";

//Variables -------------------------------------------------------------
let uploadFilesBtn = document.getElementById('upload-files');
let uploadFilesForm = document.getElementById('upload-files-form');
let uploadFilesInput = document.getElementById('upload-files-input');
let uploadFilesDropArea = document.getElementById('upload-files-drop-area');
let uploadFilesProgList = document.getElementById('upload-files-prog-list');
let uploadFilesCancel = document.getElementById('upload-files-cancel');
let uploadFilesSubmit = document.getElementById('upload-files-submit');
let uploadFilesClose = document.getElementById('upload-files-close');
let uploadedFiles = [];
let uploadProgress = {}; //Track progress per file

//Show the file upload modal
uploadFilesBtn.addEventListener('click', () => {
    uploadFilesForm.classList.remove('hidden');
    uploadFilesForm.classList.add('flex');
});

//Close/Cancel the file upload modal
uploadFilesClose.addEventListener('click', closeFileUploadModal, false);
uploadFilesCancel.addEventListener('click', closeFileUploadModal, false);

function closeFileUploadModal() {
    uploadFilesForm.classList.remove('flex');
    uploadFilesForm.classList.add('hidden');
    uploadedFiles = [];
    uploadProgress = {};
    uploadFilesInput.value = "";
    uploadFilesSubmit.disabled = true;
    uploadFilesSubmit.textContent = "Submit";
    uploadFilesCancel.classList.remove("hidden");
    uploadFilesDropArea.classList.remove('hidden');
    renderFileProgress();
}

//Submit the files and close the modal
uploadFilesSubmit.addEventListener("click", () => {
    if (uploadFilesSubmit.textContent === "Submit") {
        if (uploadedFiles.length > 0) {
            uploadFilesSubmit.disabled = true;
            uploadFilesDropArea.classList.add('hidden');
            uploadedFiles.forEach((file, index) => uploadFiles(file, index));
        }
    } else if (uploadFilesSubmit.textContent === "Done") {
        uploadedFiles.forEach((file) => {
            let fileData = {
                fileName: file.name,
                fileSize: formatFileSize(file.size),
                dateUploaded: new Date().toLocaleDateString("en-US")
            }
            handleTableRow.yourDocuments(fileData);
        });
        closeFileUploadModal();
    }
});

//Prevent default drag behaviors
["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
    uploadFilesDropArea.addEventListener(eventName, (e) => e.preventDefault(), false);
});

//Highlight the drop area on drag over
["dragenter", "dragover"].forEach(eventName => {
    uploadFilesDropArea.addEventListener(eventName, () => uploadFilesDropArea.classList.add("border-green"), false);
});

//Remove highlight on drag leave or drop
["dragleave", "drop"].forEach(eventName => {
    uploadFilesDropArea.addEventListener(eventName, () => uploadFilesDropArea.classList.remove("border-green"), false);
});

//Handle dropped files
uploadFilesDropArea.addEventListener("drop", (event) => {
    const droppedFiles = Array.from(event.dataTransfer.files);
    updateFileList(droppedFiles);
});

//Handle selected files
uploadFilesInput.addEventListener('change', (event) => {
    const selectedFiles = Array.from(event.target.files);
    updateFileList(selectedFiles);
});

function updateFileList(selectedFiles) {
    uploadedFiles = [...uploadedFiles, ...selectedFiles];
    uploadProgress = {};
    uploadedFiles.forEach((file, index) => (uploadProgress[index] = 0));
    renderFileProgress();
    uploadFilesSubmit.textContent = "Submit";
    uploadFilesSubmit.disabled = uploadedFiles.length === 0;
}

//Shows the uploaded files in a list with a progress tracker
function renderFileProgress() {
    uploadFilesProgList.innerHTML = "";
    uploadedFiles.forEach((file, index) => {
        const fileElem = document.createElement("div");
        fileElem.className = "flex flex-col bg-gray-50 p-4 rounded-lg";
        fileElem.innerHTML = `
            <div class="flex">
                <p class="text-xs text-black flex-1">
                    <i class="fa-solid fa-file-lines w-5 mr-2 inline-block text-lg"></i>
                    ${file.name} <span class="ml-2">(${formatFileSize(file.size)})</span>
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
            uploadProgress = {};
            uploadedFiles.forEach((file, index) => (uploadProgress[index] = 0));
            renderFileProgress();
            uploadFilesSubmit.disabled = uploadedFiles.length === 0;
        })
    });
};

function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
}
//Upload the files to the cloud and show progress
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

//Makes sure all uploads are done before allowing modal closure
function checkUploadsComplete() {
    const allDone = Object.values(uploadProgress).every((val) => val === 100);
    if (allDone) {
        uploadFilesSubmit.disabled = false;
        uploadFilesSubmit.textContent = "Done";
        uploadFilesCancel.classList.add("hidden");
    }
}