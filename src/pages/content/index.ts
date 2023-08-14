chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
      if(message.type == "getText") {
        var url = window.location.href;
        var text = document.body.innerText;
        // Check if it's google docs to properly fetch document data
        if (url.startsWith("https://docs.google.com")) {
          var scripts = document.getElementsByTagName("script")
          for(var i = 0; i < scripts.length; i++) {
            if (scripts[i].innerText.startsWith("DOCS_modelChunk")) {
              var snippet = scripts[i].innerText;
              var start = snippet.indexOf("[{");
              var end = snippet.lastIndexOf("}]")
              if(start != -1 && end != -1) {
                var json = JSON.parse(snippet.substring(start, end + 2))
                text += json[0].s;
              }
            }
          }
        }
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