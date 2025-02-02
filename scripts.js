import {configureClient, fetchMyUser, getAuth0Client, login, logout, subscribe, updateUI} from "./auth0";
import {apiUrl} from "./cfg";
import {checkResError, handleResError} from "./utils";

//const host = 'http://localhost:3000';

var globals = {
    paymentUrl: undefined,
};


const setHandlers = async () => {
    document.getElementById('login-btn').addEventListener('click', async () => {
        login();
    });
    document.getElementById('logout-btn').addEventListener('click', async () => {
        logout();
    });
    document.getElementById('pricing-login').addEventListener('click', async () => {
        login();
    });
    document.getElementById('pricing-sub').addEventListener('click', async () => {
        subscribe();
    });
};

document.addEventListener("DOMContentLoaded", async function () {
    console.log('DOMContentLoaded init...');

    document.querySelectorAll(".logged-in").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".subbed").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".logged-out").forEach(el => el.classList.remove("hidden"));
    document.querySelectorAll(".unsubbed").forEach(el => el.classList.add("hidden"));

    await setHandlers();
    await configureClient();
    await updateUI();

    const isAuthenticated = await getAuth0Client().isAuthenticated();

    if (isAuthenticated) {
        console.log('User is authenticated');
    }
    // NEW - check for the code and state parameters
    if (!isAuthenticated) {
        const query = window.location.search;
        if (query.includes("code=") && query.includes("state=")) {

            // Process the login state
            await getAuth0Client().handleRedirectCallback();
            await updateUI();

            // Use replaceState to redirect the user away and remove the querystring parameters
            console.log('Redirecting to remove query params');
            window.history.replaceState({}, document.title, "/");
        }
    }


    const dropzone = document.querySelector('.dropzone');
    const fileInput = document.getElementById('file');
    const filenamePreview = document.getElementById('filename-preview');
    const uploadText = document.getElementById('upload-text');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const loading = document.getElementById('loading');


    const getTranslationButton = document.getElementById('get-translation-btn');
    getTranslationButton.addEventListener('click', async () => {
        console.log('clicked.');

        const downloadButton = document.getElementById('download-button');
        const loadingDownload = document.getElementById('loading-download');
        document.getElementById('upload-container').classList.add('hidden');
        document.getElementById('highlights').classList.add('hidden');
        const step4 = document.getElementById('step4');
        step4.classList.remove('hidden');
        getTranslationButton.classList.remove('hidden');
        console.log('set up click');

        step2.classList.add('hidden');
        loading.classList.remove('hidden');
        getTranslationButton.classList.add('hidden');
        loadingDownload.classList.remove('hidden');
        // clear input and hide step2
        //fileInput.value = '';
        //filenamePreview.textContent = '';
        try {

            const formData = prepareInput();
            const targetLanguageInput = document.getElementById('target-language');
            const targetLanguage = targetLanguageInput.value; // Pobierz wartość z pola target-language
            // Sprawdź, czy pole target-language nie jest puste
            if (!targetLanguage || targetLanguage.length !=2) {
                alert('Please enter the target 2-letter language code. ');
                return;
            }
            formData.append('targetLanguage', targetLanguage); // Dodaj wartość target-language do danych formularza

            const token = await getAuth0Client().getTokenSilently();
            const response = await fetch(`${apiUrl}/api/translate`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            await checkResError(response);
            const fileId = await response.text();
            console.log(fileId);
            let downloadUrl = `${apiUrl}/file/${fileId}`;
            // set url for downloadButton
            downloadButton.href = downloadUrl;
            document.getElementById('loadingSuccess').classList.remove('hidden');
            loadingDownload.classList.add('hidden');
        } catch (error) {
            handleResError(error);
        }
        step2.classList.add('hidden');
        loading.classList.add('hidden');

    });


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
        if (file && file.size > 350 * 1024) {
            alert('File too big. Max is 350KB.');
            this.value = '';
            throw new Error('File too big. Max is 350KB.');
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

    function validateFile(file) {

        if (!file) {
            alert("Please select a file.");
            throw new Error('No file selected.');
        }

        const allowedExtensions = ['srt']; // Add more extensions as needed
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            alert("Invalid file type. Allowed extensions: " + allowedExtensions.join(', '));

            // Clear file input
            fileInput.value = ''; // Reset the value to clear the file input
            throw new Error('Invalid file type.');
        }
    }

    async function handleFiles(files) {

        const isAuthenticated = await getAuth0Client().isAuthenticated();

        if (isAuthenticated) {
                const user = await fetchMyUser();
                console.log({user})
                if(!user.premium){
                    document.getElementById('pricing').scrollIntoView({behavior: 'smooth'});
                    return;
                }
        } else {
            // navigate smoothly to #pricing el
            document.getElementById('pricing').scrollIntoView({behavior: 'smooth'});
            return;
        }

        if (files.length !== 1) {
            alert('Only one file allowed.');
            throw new Error('Only one file allowed.');
        }
        validateFile(files[0]);
        console.log({files})
        if (!files || files.length === 0) return;
        const file = files[0];

        filenamePreview.textContent = file.name;
        filenamePreview.classList.remove('hidden');
        uploadText.classList.add('hidden');
        step2.classList.remove('hidden');
    }

    console.log('DOMContentLoaded done.');
});



const languageCodes = [
    "AR",
    "BG",
    "CS",
    "DA",
    "DE",
    "EL",
    "EN",
    /*      "EN-GB",
          "EN-US",*/
    "ES",
    "ET",
    "FI",
    "FR",
    "HU",
    "ID",
    "IT",
    "JA",
    "KO",
    "LT",
    "LV",
    "NB",
    "NL",
    "PL",
    "PT",
    /*   "PT-BR",
       "PT-PT",*/
    "RO",
    "RU",
    "SK",
    "SL",
    "SV",
    "TR",
    "UK",
    "ZH"
];
const prepareInput = () => {
    const fileInput = document.getElementById('file');
    const file = fileInput.files[fileInput.files.length - 1];
    console.log({fileInput})
    console.log({file})
    const formData = new FormData();
    formData.append('file', file);
    return formData;
}

