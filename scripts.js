const host = 'https://api.translatesubtitles.org';
//const host = 'http://localhost:3000';
document.addEventListener("DOMContentLoaded", function() {
    const dropzone = document.querySelector('.dropzone');
    const fileInput = document.getElementById('file');
    const filenamePreview = document.getElementById('filename-preview');
    const uploadText = document.getElementById('upload-text');
    const step2 = document.getElementById('step2');
    const loading = document.getElementById('loading');
    const submitButton = document.getElementById('submit');
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
        const file = files[0];
        if (file && file.size > 350 * 1024) { // Sprawdzenie, czy rozmiar pliku przekracza 350 KB
            alert('Plik jest zbyt duży. Maksymalny rozmiar pliku to 350 KB.');
            this.value = ''; // Wyczyszczenie wybranego pliku
        }
        fileInput.files = e.dataTransfer.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        const file = files[0];
        if (file && file.size > 350 * 1024) { // Sprawdzenie, czy rozmiar pliku przekracza 350 KB
            alert('Files under <350kb allowed');
            this.value = ''; // Wyczyszczenie wybranego pliku
        }
        handleFiles(files);
    });

    function handleFiles(files) {
        console.log({files})
        if (!files || files.length === 0) return;
        const file = files[0];

        filenamePreview.textContent = file.name;
        filenamePreview.classList.remove('hidden');
        uploadText.classList.add('hidden');
        step2.classList.remove('hidden');
    }

    // Obsługa przesyłania pliku i tłumaczenia
    submitButton.addEventListener('click', async () => {
        step2.classList.add('hidden');
        loading.classList.remove('hidden');

        const file = fileInput.files[fileInput.files.length - 1];
        console.log({fileInput})
        console.log({file})
        const targetLanguageInput = document.getElementById('target-language');
        const targetLanguage = targetLanguageInput.value; // Pobierz wartość z pola target-language

        // Sprawdź, czy pole target-language nie jest puste
        if (!targetLanguage) {
            alert('Please enter the target language code.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('targetLanguage', targetLanguage); // Dodaj wartość target-language do danych formularza

        // clear input and hide step2
        fileInput.value = '';
        try {
            const response = await fetch(`${host}/translate`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                let errorMessage = 'Error';
                try {
                    const errorResponse = await response.json();
                    if (errorResponse && errorResponse.message) {
                        errorMessage = errorResponse.message;
                    }
                } catch (error) {
                    console.error('Error', error);
                }
                throw new Error(errorMessage);
            }

            const fileId = await response.text();
            // Tutaj możesz obsłużyć przetłumaczony tekst, np. wyświetlić go na stronie
            console.log(fileId);
            window.open(`${host}/file/${fileId}`);

        } catch (error) {
            alert(error);
            console.error('Error:');
            console.error(error);//
        }
        step2.classList.add('hidden');
        loading.classList.add('hidden');

    });
});
