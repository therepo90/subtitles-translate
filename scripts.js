import {
    buyCoins,
    configureClient,
    fetchMyUser,
    getAuth0Client,
    getSub,
    login,
    logout,
    subscribe,
    unsubscribe,
    updateUI
} from "./auth0";
import {apiUrl} from "./cfg";
import {checkResError, handleResError} from "./utils";

//const host = 'http://localhost:3000';

var globals = {
    paymentUrl: undefined,
};


const openSubscribeModal = async () => {
    subscribe();
    //document.getElementById('modal_subscribe').checked = true; // open modal
}
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
        openSubscribeModal();
    });

    document.getElementById('manage').addEventListener('click', async () => {
        document.getElementById('modal_manage').checked = true; // open modal
        const user = await fetchMyUser();
        const coins = user.usagesLeft;
        document.getElementById('coins').textContent = coins;
        const sub = await getSub();
        document.getElementById('coins').textContent = coins;
        if (sub) {
            document.getElementById('curr-period-end').textContent = new Date(sub.currentPeriodEnd).toISOString().split('T')[0];
            document.getElementById('next-payment').textContent = new Date(sub.nextPaymentDate).toISOString().split('T')[0];
            const formattedCurrency = sub.amountDue.toLocaleString('en-US', {
                style: 'currency',
                currency: sub.currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            console.log(formattedCurrency);
            document.getElementById('amount').textContent = formattedCurrency;
        }
    });
    document.getElementById('unsub-btn').addEventListener('click', async () => {
        document.getElementById('modal_unsub').checked = true; // open modal
        //document.getElementById('modal_1').checked = false; // close modal
    });
    document.getElementById('buy-coins-btn').addEventListener('click', async () => {
        buyCoins();
    });
    document.getElementById('unsub-yes').addEventListener('click', async () => {
        unsubscribe().then(() => {
            alert('done');
            window.location.reload();
        });
    });
};

function getTargetLang() {
    const targetLanguageInput = document.getElementById('target-language');
    const targetLanguage = targetLanguageInput.value; // Pobierz wartość z pola target-language
    return targetLanguage;
}

async function startTranslateFiles(fileInput, targetLanguage) {
    const files = fileInput.files;
    for (let i = 0; i < files.length; i++) {
        const downloadButton = document.getElementById('download-btn-'+i);
        const loadingDownload = document.getElementById('loading-'+i);
        const error = document.getElementById('error-'+i);
        loadingDownload.classList.remove('hidden');
        await translateFile(fileInput, targetLanguage, i)
            .then(dlUrl => {
                downloadButton.classList.remove('hidden');
                downloadButton.href = dlUrl;
            })
            .catch(err => {
                console.error(err);
                error.classList.remove('hidden');
                error.innerText = `Error: ${err.message}`;
                //alert('Error translating file ' + files[i].name);
                // todo dom el
            }).finally(() => {
                loadingDownload.classList.add('hidden');
            });
    }

}
async function translateFile(fileInput, targetLanguage,i) {
    const formData = prepareInput(fileInput.files[i]);
    formData.append('targetLanguage', targetLanguage); // Dodaj wartość target-language do danych formularza

    const token = await getAuth0Client().getTokenSilently();
    const response = await fetch(`${apiUrl}/api/translate`, {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    await checkResError(response, false); // moze false, bo errory z api nie widac
    const fileId = await response.text();
    console.log(fileId);
    let downloadUrl = `${apiUrl}/file/${fileId}`;
    // set url for downloadButton
    return downloadUrl;
    //document.getElementById('loadingSuccess').classList.remove('hidden');
    //loadingDownload.classList.add('hidden');
}

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
        if(query.includes('error=') && query.includes("state=")){
            const error = decodeURIComponent(query.split('error_description=')[1].split('&')[0]);
            console.error('Error: ', error);
            alert(error);
            return;
        }
        if (query.includes("code=") && query.includes("state=")) {

            // handle  http://localhost:1234/?error=access_denied&error_description=Email%20address%20not%20verified.%20Please%20verify%20your%20email%20before%20logging%20in.&state=QnhvMnJ2N3kyaU1RLjVnY3ExSUVmdFpkSGZYdWpFalFGTjdvQ0Y2Q2FrSg%3D%3D

            // Process the login state
            await getAuth0Client().handleRedirectCallback();
            await updateUI();

            // Use replaceState to redirect the user away and remove the querystring parameters
            console.log('Redirecting to remove query params');
            window.history.replaceState({}, document.title, "/");
        }
    }



    const fileInput = document.getElementById('file');
    const filenamePreview = document.getElementById('filename-preview');
    const uploadText = document.getElementById('upload-text');
    const dropzoneContainer = document.getElementById('dropzone');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    //const loading = document.getElementById('loading');

    const getTranslationButton = document.getElementById('get-translation-btn');
    getTranslationButton.addEventListener('click', async () => {
        console.log('clicked.');

        //document.getElementById('upload-container').classList.add('hidden');
        //document.getElementById('highlights').classList.add('hidden');
        //getTranslationButton.classList.remove('hidden');
        //console.log('set up click');

        // clear input and hide step2
        //fileInput.value = '';
        //filenamePreview.textContent = '';
        try {
            const targetLanguage = getTargetLang();
            if (targetLanguage && targetLanguage.length === 2) {
                step2.classList.add('hidden');
                //loading.classList.remove('hidden');
                getTranslationButton.classList.add('hidden');
                await startTranslateFiles(fileInput, targetLanguage);
                //step2.classList.add('hidden');
                //loading.classList.add('hidden');
            } else {
                alert('Please enter the target 2-letter language code. ');
            }
        } catch (error) {
            handleResError(error);
        }

    });

    const dropzone = document.querySelector('.dropzone');
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
        let fileTooBig = false;

        for (const file of files) {
            if (file.size > 350 * 1024) {
                alert(`File ${file.name} is too big. Max is 350KB.`);
                fileTooBig = true;
            }
        }

        if (fileTooBig) {
            return; // Przerywa, jeśli którykolwiek plik jest za duży
        }

        fileInput.files = files;
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
                if(!user.premium) {
                    if(!user.usagesLeft) {
                        alert('You have no usages left. Subscribe or buy more coins.');
                        document.getElementById('pricing').scrollIntoView({behavior: 'smooth'});
                        return;
                    }
                    if (files.length !== 1) {
                        alert('Only one file allowed in free version.');
                        throw new Error('Only one file allowed in free version.');
                    }
                }
        } else {
            // navigate smoothly to #pricing el
            document.getElementById('pricing').scrollIntoView({behavior: 'smooth'});
            return;
        }


        if (!files[0]) {
            alert("Please select a file.");
            throw new Error('No file selected.');
        }
        if (files.length >20 ) {
            alert('Max files 20 at once.');
            throw new Error('Max files 20 at once.');
        }
        for (const f of files) {
            validateFile(f);
        }
        console.log({files})
        if (!files || files.length === 0) return;
        //const file = files[0];

        //filenamePreview.textContent = file.name;
        /*compile handlebars with files and put to filename-previews*/
        const filenamePreview = document.getElementById('filename-previews');
        filenamePreview.innerHTML = '';
        const templateSource = document.getElementById('files-template').innerHTML;
        const template = window.Handlebars.compile(templateSource);
        let tplObj = {files: [].slice.call(files).map((f, i) => ({name: f.name, index: i}))};
        console.log({tplObj})
        const html = template(tplObj);
        filenamePreview.innerHTML = html;
        filenamePreview.classList.remove('hidden');
        //uploadText.classList.add('hidden');
        dropzoneContainer.classList.add('hidden');
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
const prepareInput = (file) => {
    console.log({file})
    const formData = new FormData();
    formData.append('file', file);
    return formData;
}

