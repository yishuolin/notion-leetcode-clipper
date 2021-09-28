import '../css/popup.css';
import { getDateString } from './helpers';
import { getDatabase, addItem } from './requests';

const init = async () => {
  const db = await getDatabase();

  const showTagsPopup = () => {
    const popup = document.querySelector('#select-popup');
    if (popup.style.display === 'block') return;

    const tagsArea = document.querySelector('#tags');
    const selectedTags = [...document.querySelectorAll('.selected-tag')].map(
      (el) => el.innerText,
    );

    popup.innerHTML = '';
    getTagsPopupContent(popup, selectedTags, tagsArea);
    popup.style.display = 'block';
  };

  const getTagsPopupContent = async (popup, selectedTags, tagsArea) => {
    db.properties.Tags.multi_select.options.forEach((option) => {
      const { id, name } = option;
      popup.innerHTML += generateCheckbox(selectedTags, id, name);
    });
    popup.innerHTML += `<button id="popup-cancel">Cancel</button><button id="popup-ok">Ok</button>`;
    setTagsPopupEventListener(popup, tagsArea);
  };

  const generateCheckbox = (selectedTags, id, name) => `
    <div id="checkbox-${id}" class="checkbox-container">
      <input type="checkbox" name="checkbox-option" id="${id}" value="${name}" 
        ${selectedTags.includes(name) ? 'checked' : ''}/>
      <label for="${id}">${name}</label>
    </div>
    `;

  const setTagsPopupEventListener = (popup, tagsArea) => {
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
    const inputValues = getInputValues();
    setLoading();
    // get other parameters from content.js
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, '', (data) => {
        addItem({ ...data, ...inputValues }, createSuccess);
      });
    });
  };

  const getInputValues = () => {
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
    submitButton.style.cursor = 'default';
    setTimeout(() => {
      submitButton.innerText = 'Create';
      submitButton.style.cursor = 'pointer';
      submitButton.addEventListener('click', create);
    }, 2000);
  };

  document.getElementById('submit').addEventListener('click', create);
  document.getElementById('tags').addEventListener('click', showTagsPopup);
};

init();
