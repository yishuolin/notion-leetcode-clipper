import axios from 'axios';
import '../css/popup.css';

const NOTION_DATABASE_ID = '';
const NOTION_KEY = '';

let options = [];

const getDateString = () => {
  const d = new Date();
  const month = (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1);
  return d.getFullYear() + '-' + month + '-' + d.getDate();
};

(async () => {
  const response = await axios.get(
    `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}`,
    {
      headers: {
        Authorization: `Bearer ${NOTION_KEY}`,
        'Notion-Version': '2021-05-13',
      },
    },
  );
  options = response.data.properties.Tags.multi_select.options;
})();

const showOptions = () => {
  if (document.querySelector('#select-popup').style.display === 'block') return;
  const popup = document.querySelector('#select-popup');
  const area = document.querySelector('#tags');
  const selectedTags = [...document.querySelectorAll('.tag')].map(
    (el) => el.innerText,
  );
  popup.innerHTML = '';
  options.forEach((option) => {
    popup.innerHTML += `
      <div id="checkbox-${
        option.id
      }" class="checkbox-container"><input type="checkbox" name="option" id="${
      option.id
    }" value="${option.name}" ${
      selectedTags.includes(option.name) ? 'checked' : ''
    }/><label for="${option.id}">${option.name}</label></div>
    `;
  });
  popup.innerHTML += `<button id="popup-cancel">Cancel</button><button id="popup-ok">Ok</button>`;
  document.querySelector('#popup-cancel').addEventListener('click', () => {
    popup.style.display = 'none';
  });
  document.querySelector('#popup-ok').addEventListener('click', () => {
    popup.style.display = 'none';
    area.innerHTML = '';
    const allCheckboxes = document.getElementsByName('option');
    allCheckboxes.forEach((checkbox) => {
      if (checkbox.checked)
        area.innerHTML += `<div class="tag">${checkbox.value}</div>`;
    });
  });
  popup.style.display = 'block';
};

const addItem = async (data) => {
  const { name, link, difficulty, algorithms, notes, duration, tags } = data;

  try {
    const response = await axios.post(
      'https://api.notion.com/v1/pages/',
      {
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: name,
                },
              },
            ],
          },
          Link: {
            url: link,
          },
          Difficulty: {
            select: {
              name: difficulty,
            },
          },
          Algorithms: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: algorithms,
                },
              },
            ],
          },
          Notes: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: notes || '',
                },
              },
            ],
          },
          'Time Spent': {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: duration || '',
                },
              },
            ],
          },
          Date: {
            date: {
              start: getDateString(),
            },
          },
          Tags: {
            multi_select: [...document.querySelectorAll('.tag')].map((el) => ({
              name: el.innerText,
            })),
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${NOTION_KEY}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2021-05-13',
        },
      },
    );
    console.log(response);
    document.querySelector('#submit').innerText = 'Ok!';
    document.querySelector('#submit').removeEventListener('click', create);
    setTimeout(() => {
      document.querySelector('#submit').innerText = 'Create';
      document.querySelector('#submit').addEventListener('click', create);
    }, 2000);
  } catch (error) {
    console.log(error);
  }
};

const setLoading = () => {
  document.querySelector('#submit').innerText = 'loading...';
};

const create = () => {
  const algorithms = document.getElementById('algorithms').value;
  const notes = document.getElementById('notes').value;
  const duration = document.getElementById('duration').value;
  const tags = [];
  setLoading();
  // get other parameters from content
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, '', (dataFromContent) => {
      // call api
      addItem({ ...dataFromContent, algorithms, notes, duration, tags });
    });
  });
};

document.getElementById('submit').addEventListener('click', create);
document.getElementById('tags').addEventListener('click', showOptions);
document.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    create();
  }
});
