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
document.addEventListener("DOMContentLoaded", function () {
  const dropzone = document.querySelector('.dropzone');
  const fileInput = document.getElementById('file');
  const filenamePreview = document.getElementById('filename-preview');
  const uploadText = document.getElementById('upload-text');
  const step2 = document.getElementById('step2');
  const submitButton = document.getElementById('submit');
  // sprawdz czy sa wszystkie el, a jak nie ma to zglos ktory
  if (!dropzone || !fileInput || !filenamePreview || !uploadText || !step2 || !submitButton) {
    console.error('Brakuje elementów na stronie!');
    // ktorego brakuje?
    if (!dropzone) console.error('Brakuje dropzone');
    if (!fileInput) console.error('Brakuje fileInput');
    if (!filenamePreview) console.error('Brakuje filenamePreview');
    if (!uploadText) console.error('Brakuje uploadText');
    if (!step2) console.error('Brakuje step2');
    if (!submitButton) console.error('Brakuje submitButton');
    return;
  }
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
      // Sprawdzenie, czy rozmiar pliku przekracza 350 KB
      alert('Plik jest zbyt duży. Maksymalny rozmiar pliku to 350 KB.');
      this.value = ''; // Wyczyszczenie wybranego pliku
    }
    fileInput.files = e.dataTransfer.files;
    handleFiles(files);
  });
  fileInput.addEventListener('change', e => {
    const files = e.target.files;
    const file = files[0];
    if (file && file.size > 350 * 1024) {
      // Sprawdzenie, czy rozmiar pliku przekracza 350 KB
      alert('Plik jest zbyt duży. Maksymalny rozmiar pliku to 350 KB.');
      this.value = ''; // Wyczyszczenie wybranego pliku
    }
    handleFiles(files);
  });
  function handleFiles(files) {
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

  // Obsługa przesyłania pliku i tłumaczenia
  submitButton.addEventListener('click', async () => {
    const file = fileInput.files[fileInput.files.length - 1];
    console.log({
      fileInput
    });
    console.log({
      file
    });
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

    try {
      const response = await fetch('http://localhost:3000/translate', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error('Błąd podczas przetwarzania pliku.');
      }
      const fileId = await response.text();
      // Tutaj możesz obsłużyć przetłumaczony tekst, np. wyświetlić go na stronie
      console.log(fileId);
      window.open(`http://localhost:3000/file/${fileId}`);
    } catch (error) {
      alert(error);
      console.error('Error:');
      console.error(error);
    }
  });
});
},{}]},{},["imtx"], null)