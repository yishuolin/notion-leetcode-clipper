import { Client } from '@notionhq/client';
import { config } from 'dotenv';
config({ path: '../../.env' });

const notion = new Client({ auth: process.env.NOTION_KEY });

const databaseId = process.env.NOTION_DATABASE_ID;

async function addItem(text) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: text,
              },
            },
          ],
        },
        Link: {
          url: 'https://sample.com',
        },
        Difficulty: {
          select: {
            name: 'Easy',
          },
        },
        Algorithms: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'DP',
              },
            },
          ],
        },
        Notes: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'rich text test',
              },
              annotations: {
                italic: true,
              },
            },
          ],
        },
        'Time Spent': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: '3 min',
              },
            },
          ],
        },
        Date: {
          date: {
            start: '2021-05-17',
          },
        },
        Tags: {
          multi_select: [
            {
              name: 'DIY',
            },
            {
              name: 'easy',
            },
          ],
        },
      },
    });
    console.log(response);
    console.log('Success! Entry added.');
  } catch (error) {
    console.error(error.body);
  }
}

addItem('test title');
