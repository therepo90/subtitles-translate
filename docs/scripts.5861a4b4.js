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
})({"mhI4":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.auth0Cfg = exports.apiUrl = void 0;
const apiUrl = exports.apiUrl = "false" === 'true' ? 'http://localhost:3000' : 'https://api.translatesubtitles.org';
//export const baseUrl = process.env.LOCAL_DEV === 'true' ? 'http://localhost:3000' : 'https://api.translatesubtitles.org';
const auth0Cfg = exports.auth0Cfg = {
  "domain": "translatesubtitles.eu.auth0.com",
  "clientId": "Yl7KeMwXe4zeLMPz9zIHc33Nircfgxh1",
  authorizationParams: {
    redirect_uri: 'http://localhost:1234',
    audience: 'https://translatesubtitles'
  }
};
},{}],"hW48":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUI = exports.subscribe = exports.logout = exports.login = exports.getAuth0Client = exports.configureClient = void 0;
var _cfg = require("./cfg");
let auth0Client = null;
const getAuth0Client = () => {
  return auth0Client;
};
exports.getAuth0Client = getAuth0Client;
const configureClient = async () => {
  console.log('configureClient...');
  const config = _cfg.auth0Cfg;
  auth0Client = await window.auth0.createAuth0Client(config);
  console.log('configured.');
};
exports.configureClient = configureClient;
const updateUI = async () => {
  const isAuthenticated = await auth0Client.isAuthenticated();

  /*document.getElementById("btn-logout").disabled = !isAuthenticated;
  document.getElementById("btn-login").disabled = isAuthenticated;*/

  // NEW - add logic to show/hide gated content after authentication
  if (isAuthenticated) {
    //document.getElementById("upload-unauth").classList.add("hidden");
    //document.getElementById("upload-container").classList.remove("hidden");
    document.getElementById("gated-content").classList.remove("hidden");
    // all elements with class logged-in are shown
    document.querySelectorAll(".logged-in").forEach(el => el.classList.remove("hidden"));
    document.querySelectorAll(".logged-out").forEach(el => el.classList.add("hidden"));
    // subbed/unsubbed todo
    //const token = await auth0Client.getTokenSilently();

    /*
            document.getElementById(
                "ipt-access-token"
            ).innerHTML = await auth0Client.getTokenSilently();
    
            document.getElementById("ipt-user-profile").textContent = JSON.stringify(
                await auth0Client.getUser()
            );*/
    const token = await auth0Client.getTokenSilently();
    const baseUrl = _cfg.apiUrl;
    const response = await fetch(baseUrl + "/api/user", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    //const data = {premium: false};
    const userPremium = data.premium;
    if (userPremium) {
      document.querySelectorAll(".subbed").forEach(el => el.classList.remove("hidden"));
      document.querySelectorAll(".unsubbed").forEach(el => el.classList.add("hidden"));
    } else {
      document.querySelectorAll(".subbed").forEach(el => el.classList.add("hidden"));
      document.querySelectorAll(".unsubbed").forEach(el => el.classList.remove("hidden"));
    }
  } else {
    document.querySelectorAll(".logged-in").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".logged-out").forEach(el => el.classList.remove("hidden"));
    //document.getElementById("upload-unauth").classList.remove("hidden");
    //document.getElementById("upload-container").classList.add("hidden");
    document.getElementById("gated-content").classList.add("hidden");
  }
};

// ..
exports.updateUI = updateUI;
const login = async () => {
  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });
};
exports.login = login;
const logout = () => {
  auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });
};
exports.logout = logout;
const subscribe = async () => {
  console.log('subscribe');
  const isAuthenticated = await auth0Client.isAuthenticated();
  if (!isAuthenticated) {
    login();
    return;
  }
  const token = await auth0Client.getTokenSilently();
  console.log(token);
  const baseUrl = _cfg.apiUrl;
  const response = await fetch(baseUrl + "/api/stripe/checkout-premium", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
  console.log('rdr');
  window.location.href = data.url;
};
exports.subscribe = subscribe;
},{"./cfg":"mhI4"}],"imtx":[function(require,module,exports) {
"use strict";

var _auth = require("./auth0");
var _cfg = require("./cfg");
//const host = 'http://localhost:3000';

var globals = {
  paymentUrl: undefined
};
const setHandlers = async () => {
  document.getElementById('login-btn').addEventListener('click', async () => {
    (0, _auth.login)();
  });
  document.getElementById('logout-btn').addEventListener('click', async () => {
    (0, _auth.logout)();
  });
  document.getElementById('pricing-login').addEventListener('click', async () => {
    (0, _auth.login)();
  });
  document.getElementById('pricing-sub').addEventListener('click', async () => {
    (0, _auth.subscribe)();
  });
};
document.addEventListener("DOMContentLoaded", async function () {
  console.log('DOMContentLoaded init...');
  await setHandlers();
  await (0, _auth.configureClient)();
  await (0, _auth.updateUI)();
  const isAuthenticated = await (0, _auth.getAuth0Client)().isAuthenticated();
  if (isAuthenticated) {
    console.log('User is authenticated');
  }
  // NEW - check for the code and state parameters
  if (!isAuthenticated) {
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
      // Process the login state
      await (0, _auth.getAuth0Client)().handleRedirectCallback();
      await (0, _auth.updateUI)();

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
      if (!targetLanguage || targetLanguage.length != 2) {
        alert('Please enter the target 2-letter language code. ');
        return;
      }
      formData.append('targetLanguage', targetLanguage); // Dodaj wartość target-language do danych formularza

      const token = await (0, _auth.getAuth0Client)().getTokenSilently();
      const response = await fetch(`${_cfg.apiUrl}/api/translate`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await checkResError(response);
      const fileId = await response.text();
      console.log(fileId);
      let downloadUrl = `${_cfg.apiUrl}/file/${fileId}`;
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
      throw new Error('File too big. Max is 350KB.');
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
  async function handleFiles(files) {
    const isAuthenticated = await (0, _auth.getAuth0Client)().isAuthenticated();
    if (!isAuthenticated) {
      // navigate smoothly to #pricing el
      document.getElementById('pricing').scrollIntoView({
        behavior: 'smooth'
      });
      return;
    }
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
  console.log('DOMContentLoaded done.');
});
const languageCodes = ["AR", "BG", "CS", "DA", "DE", "EL", "EN",
/*      "EN-GB",
      "EN-US",*/
"ES", "ET", "FI", "FR", "HU", "ID", "IT", "JA", "KO", "LT", "LV", "NB", "NL", "PL", "PT",
/*   "PT-BR",
   "PT-PT",*/
"RO", "RU", "SK", "SL", "SV", "TR", "UK", "ZH"];
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
    let err;
    try {
      err = await response.clone().json();
    } catch (e) {
      err = await response.text();
    }
    handleResError(err);
    throw new Error(err);
  }
};
const handleResError = errObject => {
  let msg = errObject?.error?.message || errObject?.message;
  if (typeof errObject === 'string') {
    msg = errObject;
  }
  alert(msg || 'Error');
  console.error('Res error:');
  console.error(errObject);
};
},{"./auth0":"hW48","./cfg":"mhI4"}]},{},["imtx"], null)