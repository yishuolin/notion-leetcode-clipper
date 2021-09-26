# Notion Leetcode Clipper

A Chrome extension for clipping LeetCode problem to you Notion database.

![image](https://i.imgur.com/EQmfmQQ.gif)

## Getting Started

1. Duplicate the [database template](https://www.notion.so/yslin9901/8623ce46421a49e7bdfc449a334f08b4?v=631f11b5d34f451984a0faf593ff830c).


2. Follow the [official guide(Step 1 & Step 2)](https://developers.notion.com/docs/getting-started) from Notion to create an integration and share the database with your integration.

3. Clone the project and install dependencies.

   ```bash
   git clone https://github.com/yishuolin/notion-leetcode-clipper.git
   cd notion-leetcode-clipper
   yarn install
   ```

4. Paste your **NOTION_KEY** and **NOTION_DATABASE_ID** in `src/js/request.js`
   ```javascript
   const NOTION_KEY = '';
   const NOTION_DATABASE_ID = '';
   ```

5. Build bundle files.

   ```bash
   yarn build
   ```

6. Go to **Extension Management Page** by navigating to `chrome://extensions`

7. Enable **Developer Mode** by cliking the toggle switch on the upper right corner.

8. Click the **Load unpacked** button, select `notion-leetcode-clipper/build` directory.
