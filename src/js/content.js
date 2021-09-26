import { PROBLEM_NAME_CLASS, DIFFICULTY_CONTAINER_CLASS } from './constants';

const getProblemParameters = () => {
  const name = document.querySelector(`.${PROBLEM_NAME_CLASS}`).innerText;
  const link = window.location.href;
  const difficulty = document.querySelector(`.${DIFFICULTY_CONTAINER_CLASS}`)
    .firstChild.innerText;
  return { name, link, difficulty };
};
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse(getProblemParameters());
  return true;
});
