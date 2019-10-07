document.addEventListener('DOMContentLoaded', function () {

  const saveButtonHandwriting = document.getElementById('save-button-handwriting')
  const editorElement = document.getElementById('editor');
  const handwritingResultInput = document.getElementById('result-input')

  const languageElement = document.getElementById('language');
  const undoElement = document.getElementById('undo');
  const redoElement = document.getElementById('redo');
  const clearElement = document.getElementById('clear');
  editorElement.addEventListener('changed', function (event) {
    undoElement.disabled = !event.detail.canUndo;
    redoElement.disabled = !event.detail.canRedo;
  });
  editorElement.addEventListener('exported', function (evt) {
    const exports = evt.detail.exports;
    if (exports && exports['text/plain']) {
      clearElement.disabled = false;
      handwritingResultInput.innerText = exports['text/plain'];
    } else {
      clearElement.disabled = true;
      handwritingResultInput.innerText = ""
    }
  });
  editorElement.addEventListener('loaded', function (evt) {
    /**
     * Retrieve the list of available recognition languages
     *  @param {Object} The editor recognition parameters
     */
    let currentLanguage = evt.target.editor.configuration.recognitionParams.v4.lang;
    let res = MyScript.getAvailableLanguageList();
    if (languageElement.options.length === 0) {
      Object.keys(res.result).forEach(function (key) {
        var selected = currentLanguage === key;
        languageElement.options[languageElement.options.length] = new Option(res.result[key], key, selected, selected);
      });
    }
  });
  languageElement.addEventListener('change', function (e) {
    var configuration = editorElement.editor.configuration;
    //The path to the language depend of the version of API you are using.
    configuration.recognitionParams.v4.lang = e.target.value;
    editorElement.editor.configuration = configuration;
  });
  undoElement.addEventListener('click', function () {
    editorElement.editor.undo();
  });
  redoElement.addEventListener('click', function () {
    editorElement.editor.redo();
  });
  clearElement.addEventListener('click', function () {
    editorElement.editor.clear();
  });
  /**
   * Attach an editor to the document
   * @param {Element} The DOM element to attach the ink paper
   * @param {Object} The recognition parameters
   */
  MyScript.register(editorElement, {
    triggers: {
      exportContent: 'QUIET_PERIOD'
    },
    recognitionParams: {
      type: 'TEXT',
      protocol: 'REST',
      apiVersion: 'V4',
      server: {
        scheme: 'https',
        applicationKey: '66d121e7-9bcf-4c72-8534-f4a52a145acc',
        hmacKey: 'bcee3740-6c6c-4347-b467-05d415fbb47a'
      },
      v4: {
        text: {
          guides: {
            enable: false
          },
          mimeTypes: ['text/plain', 'application/vnd.myscript.jiix'],
        }
      }
    }
  });
  window.addEventListener('resize', function () {
    editorElement.editor.resize();
  });


  saveButtonHandwriting.addEventListener('click', function (e) {
    document.getElementById('script').submit();
  })
})
