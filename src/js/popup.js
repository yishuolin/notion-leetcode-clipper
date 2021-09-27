import '../css/popup.css';
import { getDateString } from './helpers';
import { getDatabase, addItem } from './requests';

let options = [];
(async () => {
  options = await getDatabase();
})();

const showOptionsPopup = () => {
  const popup = document.querySelector('#select-popup');
  if (popup.style.display === 'block') return;

  const tagsArea = document.querySelector('#tags');
  const selectedTags = [...document.querySelectorAll('.selected-tag')].map(
    (el) => el.innerText,
  );

  popup.innerHTML = '';
  getOptionsPopupContent(popup, selectedTags);
  addOptionsPopupEventListener(popup, tagsArea);

  popup.style.display = 'block';
};

const getOptionsPopupContent = (popup, selectedTags) => {
  options.forEach((option) => {
    const { id, name } = option;
    popup.innerHTML += getCheckbox(selectedTags, id, name);
  });
  popup.innerHTML += `<button id="popup-cancel">Cancel</button><button id="popup-ok">Ok</button>`;
};

const getCheckbox = (selectedTags, id, name) => `
  <div id="checkbox-${id}" class="checkbox-container">
    <input type="checkbox" name="checkbox-option" id="${id}" value="${name}" 
      ${selectedTags.includes(name) ? 'checked' : ''}/>
    <label for="${id}">${name}</label>
  </div>
  `;

const addOptionsPopupEventListener = (popup, tagsArea) => {
  document.querySelector('#popup-cancel').addEventListener('click', () => {
    popup.style.display = 'none';
  });
  document.querySelector('#popup-ok').addEventListener('click', () => {
    popup.style.display = 'none';
    tagsArea.innerHTML = '';
    document.getElementsByName('checkbox-option').forEach((checkbox) => {
      if (checkbox.checked)
        tagsArea.innerHTML += `<div class="selected-tag">${checkbox.value}</div>`;
    });
  });
};

const setLoading = () => {
  document.querySelector('#submit').innerText = 'loading...';
};

const create = () => {
  const inputValue = getInputValue();
  setLoading();
  // get other parameters from content.js
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, '', (dataFromContent) => {
      addItem({ ...dataFromContent, ...inputValue }, createSuccess);
    });
  });
};

const getInputValue = () => {
  const algorithms = document.getElementById('algorithms').value;
  const notes = document.getElementById('notes').value;
  const duration = document.getElementById('duration').value;
  const date = getDateString();
  const tags = [...document.querySelectorAll('.selected-tag')].map((el) => ({
    name: el.innerText,
  }));
  return { algorithms, notes, duration, date, tags };
};

const createSuccess = () => {
  const submitButton = document.querySelector('#submit');
  submitButton.innerText = 'Ok!';
  submitButton.removeEventListener('click', create);
  setTimeout(() => {
    submitButton.innerText = 'Create';
    submitButton.addEventListener('click', create);
  }, 2000);
};

document.getElementById('submit').addEventListener('click', create);
document.getElementById('tags').addEventListener('click', showOptionsPopup);
