var text = document.body.innerText;

chrome.runtime.onMessage.addListener(
  function (message, sender, sendResponse) {
    sendResponse(text);
  }
);