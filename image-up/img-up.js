const dropzone = document.querySelector('.dropzone');
const fileInput = document.getElementById('file');
const preview = document.getElementById('preview');
const previewImage = document.getElementById('previewImage');

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('drag-over');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    handleFiles(files);
});

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFiles(files);
});

function handleFiles(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        previewImage.src = event.target.result;
        preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

// Additional logic for click to select file
const uploadButton = document.querySelector('button');
uploadButton.addEventListener('click', () => {
    fileInput.click();
});
