// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"imtx":[function(require,module,exports) {
const host = "false" === 'true' ? 'http://localhost:3000' : 'https://api.translatesubtitles.org';
//const host = 'http://localhost:3000';

var globals = {
  paymentUrl: undefined
};
document.addEventListener("DOMContentLoaded", function () {
  const dropzone = document.querySelector('.dropzone');
  const fileInput = document.getElementById('file');
  const filenamePreview = document.getElementById('filename-preview');
  const uploadText = document.getElementById('upload-text');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  const loading = document.getElementById('loading');
  const calcCost = document.getElementById('calc-cost');
  const costPreview = document.getElementById('cost-preview');
  async function redirectToCheckout() {
    console.log('Redirecting to' + globals.paymentUrl);
    window.open(globals.paymentUrl);
  }
  const checkoutButton = document.getElementById('checkout-button');
  checkoutButton.addEventListener('click', () => redirectToCheckout());
  dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('drag-over');
  });
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    const file = files[0];
    if (file && file.size > 350 * 1024) {
      alert('File too big. Max is 350KB.');
      this.value = '';
    }
    fileInput.files = e.dataTransfer.files;
    handleFiles(files);
  });
  fileInput.addEventListener('change', e => {
    const files = e.target.files;
    const file = files[0];
    if (file && file.size > 350 * 1024) {
      // Sprawdzenie, czy rozmiar pliku przekracza 350 KB
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
  function handleFiles(files) {
    if (files.length !== 1) {
      alert('Only one file allowed.');
      throw new Error('Only one file allowed.');
    }
    validateFile(files[0]);
    console.log({
      files
    });
    if (!files || files.length === 0) return;
    const file = files[0];
    filenamePreview.textContent = file.name;
    filenamePreview.classList.remove('hidden');
    uploadText.classList.add('hidden');
    step2.classList.remove('hidden');
  }
  const languageCodes = ["AR", "BG", "CS", "DA", "DE", "EL", "EN",
  /*      "EN-GB",
        "EN-US",*/
  "ES", "ET", "FI", "FR", "HU", "ID", "IT", "JA", "KO", "LT", "LV", "NB", "NL", "PL", "PT",
  /*   "PT-BR",
     "PT-PT",*/
  "RO", "RU", "SK", "SL", "SV", "TR", "UK", "ZH"];
  // Obsługa przesyłania pliku i tłumaczenia
  calcCost.addEventListener('click', async () => {
    costPreview.textContent = '';
    const formData = prepareInput();
    const targetLanguageInput = document.getElementById('target-language');
    const targetLanguage = targetLanguageInput.value; // Pobierz wartość z pola target-language
    // Sprawdź, czy pole target-language nie jest puste
    if (!targetLanguage || targetLanguage.length != 2) {
      alert('Please enter the target 2-letter language code. ');
      return;
    }
    formData.append('targetLanguage', targetLanguage); // Dodaj wartość target-language do danych formularza

    try {
      const response = await fetch(`${host}/check-file`, {
        method: 'POST',
        body: formData
      });
      await checkResError(response);
      const res = await response.json();
      console.log({
        res
      });
      const {
        price,
        url,
        free,
        token
      } = res;
      globals.paymentUrl = url;
      console.log(price, globals.paymentUrl);
      if (free) {
        costPreview.textContent = `You are lucky. Its free. Loading...`;
        // add token to query param
        setTimeout(() => {
          const url = new URL(window.location.href);
          url.searchParams.set('token', token);
          window.location.replace(url);
        }, 2000);
      } else {
        costPreview.textContent = `Cost: ${price}€`;
        step3.classList.remove('hidden');
        // costPreview.textContent = `Quota not available. Come back next month or email me.`;
      }

      //if(cost === 'free') {

      //}
    } catch (error) {
      // if(error?.message?.toLowerCase().includes('quota')) {
      //alert('Quota exceFeded. Come back later.'); // @TODO rmv
      //costPreview.textContent = `Quota exceeded. Come back 01 may.` // @TODO rmv
      //}
      handleResError(error);
    }
  });
  const prepareInput = () => {
    const file = fileInput.files[fileInput.files.length - 1];
    console.log({
      fileInput
    });
    console.log({
      file
    });
    const formData = new FormData();
    formData.append('file', file);
    return formData;
  };
  const checkResError = async response => {
    if (!response.ok) {
      // if 429 say to come back later
      if (response.status === 429) {
        const msg = 'Too many requests. Please try again in 2 hours.';
        alert(msg);
        throw new Error(msg);
      }
      let errorMessage = 'Api error';
      try {
        const errorResponse = await response.json();
        if (errorResponse && (errorResponse?.message || errorResponse?.error?.message)) {
          errorMessage = errorResponse?.message || errorResponse?.error?.message;
        }
      } catch (error) {
        handleResError(error);
      }
      throw new Error(errorMessage);
    }
  };
  const handleResError = errObject => {
    alert(errObject?.error?.message || errObject?.message || 'Error');
    console.error('Res error:');
    console.error(errObject);
  };
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get('token');
  console.log({
    token
  });
  if (token) {
    console.log('Payment done');
    const downloadButton = document.getElementById('download-button');
    const loadingDownload = document.getElementById('loading-download');
    document.getElementById('upload-container').classList.add('hidden');
    document.getElementById('highlights').classList.add('hidden');
    const step4 = document.getElementById('step4');
    step4.classList.remove('hidden');
    downloadButton.classList.remove('hidden');
    downloadButton.addEventListener('click', async () => {
      step2.classList.add('hidden');
      loading.classList.remove('hidden');
      downloadButton.classList.add('hidden');
      loadingDownload.classList.remove('hidden');
      // clear input and hide step2
      //fileInput.value = '';
      //filenamePreview.textContent = '';
      try {
        const response = await fetch(`${host}/translate`, {
          method: 'POST',
          body: JSON.stringify({
            token
          }),
          headers: {
            'Content-Type': 'application/json' // Specify the content type
          }
        });
        if (!response.ok && response.status === 401) {
          const msg = `Token can be used only once. Check popup window.
                     If you dont have the subtitles, contact therepo90@gmail.com`;
          alert(msg);
          throw new Error(msg);
        }
        await checkResError(response);
        const fileId = await response.text();
        console.log(fileId);
        window.open(`${host}/file/${fileId}`);
        document.getElementById('loadingSuccess').classList.remove('hidden');
        loadingDownload.classList.add('hidden');
      } catch (error) {
        handleResError(error);
      }
      step2.classList.add('hidden');
      loading.classList.add('hidden');
    });
  }
  // call endpoint translate and pass token in body
});
},{}]},{},["imtx"], null)