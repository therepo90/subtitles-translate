document.addEventListener("DOMContentLoaded", function() {
    const dropzone = document.querySelector('.dropzone');
    const fileInput = document.getElementById('file');
    const filenamePreview = document.getElementById('filename-preview');
    const uploadText = document.getElementById('upload-text');
    const submit = document.getElementById('submit');

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
        filenamePreview.textContent = file.name;
        filenamePreview.classList.remove('hidden');
        uploadText.classList.add('hidden');
        submit.classList.remove('hidden');
    }

    // Additional logic for click to select file
    const uploadButton = document.querySelector('button');
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });
});
