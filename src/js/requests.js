import axios from 'axios';
import { BASE_URL } from './constants';

const NOTION_KEY = '';
const NOTION_DATABASE_ID = '';

const request = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${NOTION_KEY}`,
    'Notion-Version': '2021-05-13',
  },
  timeout: 20000,
});

const getDatabase = async (id = NOTION_DATABASE_ID) => {
  const response = await request.get(`/databases/${id}`, {
    headers: {
      Authorization: `Bearer ${NOTION_KEY}`,
      'Notion-Version': '2021-05-13',
    },
  });
  return response.data;
};

const addItem = async (data, callback, id = NOTION_DATABASE_ID) => {
  const { name, link, difficulty, algorithms, notes, duration, date, tags } =
    data;
  const body = {
    parent: { database_id: id },
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
              content: notes,
            },
          },
        ],
      },
      'Time Spent': {
        rich_text: [
          {
            type: 'text',
            text: {
              content: duration,
            },
          },
        ],
      },
      Date: {
        date: {
          start: date,
        },
      },
      Tags: {
        multi_select: tags,
      },
    },
  };
  try {
    const response = await request.post(`/pages/`, body, {
      headers: {
        Authorization: `Bearer ${NOTION_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2021-05-13',
      },
    });
    console.log(response);
    callback();
  } catch (error) {
    console.log(error);
  }
};

export { getDatabase, addItem };
