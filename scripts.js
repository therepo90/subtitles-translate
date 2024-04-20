document.addEventListener("DOMContentLoaded", function() {
    const dropzone = document.querySelector('.dropzone');
    const fileInput = document.getElementById('file');
    const filenamePreview = document.getElementById('filename-preview');
    const uploadText = document.getElementById('upload-text');
    const step2 = document.getElementById('step2');
    const submitButton = document.getElementById('submit');
    let uploadedFile = null;
    // sprawdz czy sa wszystkie el, a jak nie ma to zglos ktory
    if (!dropzone || !fileInput || !filenamePreview || !uploadText || !step2 || !submitButton) {
        console.error('Brakuje elementów na stronie!');
        // ktorego brakuje?
        if(!dropzone) console.error('Brakuje dropzone');
        if(!fileInput) console.error('Brakuje fileInput');
        if(!filenamePreview) console.error('Brakuje filenamePreview');
        if(!uploadText) console.error('Brakuje uploadText');
        if(!step2) console.error('Brakuje step2');
        if(!submitButton) console.error('Brakuje submitButton');
        return;
    }
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
        console.log({files})
        if (!files || files.length === 0) return;
        const file = files[0];
        // Usunięcie poprzedniego pliku
        if (uploadedFile) {
            URL.revokeObjectURL(uploadedFile);
        }

        uploadedFile = file;
        filenamePreview.textContent = file.name;
        filenamePreview.classList.remove('hidden');
        uploadText.classList.add('hidden');
        step2.classList.remove('hidden');
    }

    // Obsługa przesyłania pliku i tłumaczenia
    submitButton.addEventListener('click', async () => {
        const file = fileInput.files[fileInput.files.length - 1];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3000/translate', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Błąd podczas przetwarzania pliku.');
            }

            const translatedText = await response.text();
            // Tutaj możesz obsłużyć przetłumaczony tekst, np. wyświetlić go na stronie
            console.log(translatedText);
            // Usunięcie poprzedniego pliku z inputa
            fileInput.value = '';
        } catch (error) {
            alert(error.message);
            console.error('Error:', error.message);
        }

    });
});
