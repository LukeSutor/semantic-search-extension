chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
      if(message.type == "getText") {
        var text = document.body.innerText;
        sendResponse(text);
      } else if(message.type == "highlight") {
        // ******** 
        // Code for highlighting text on webpages, doesn't work for reactive webpages, only pure HTML ones like wikipedia
        // ********
        // var text = document.body.innerHTML;
        // var searchText = message.search
        // console.log(searchText);
        // const regex = new RegExp(searchText, 'gi');
        // text = text.replace(/(<mark>|<\/mark>)/gim, '');
        // const newText = text.replace(regex, '<mark>$&</mark>');
        // document.body.innerHTML = newText
      } else {
      }
    }
  );