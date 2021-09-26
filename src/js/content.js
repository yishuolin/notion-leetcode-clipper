chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse(getParameters());
  return true;
});

const getParameters = () => {
  const name = document.querySelector('.css-v3d350').innerText;
  const link = window.location.href;
  const difficulty =
    document.querySelector('.css-10o4wqw').firstChild.innerText;
  return { name, link, difficulty };
};
