import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './Popup.css';

const Popup = () => {

  const [page, setPage] = useState(0)

  const [pageText, setPageText] = useState("")

  const [question, setQuestion] = useState("")

  const [answer, setAnswer] = useState("nothing yet")

  // Make a request to the content script to fetch the current website's text
  // And set the answer state to that recieved text
  function getText() {
    chrome.tabs.query({ active: true, currentWindow: true },
      function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "getText" }, function (response) {
          setPageText(response)
        });
      });
  }

  // Get the website's text when the popup is loaded
  useEffect(() => {
    getText()
  }, [])

  // If the question changes (which means the search button was pressed)
  // Make an axios call to the hugging face api and send the question and context
  // Then set the answer to the response
  useEffect(() => {
    if (question !== "") {
      axios({
        method: 'post',
        url: 'https://api-inference.huggingface.co/models/distilbert-base-uncased-distilled-squad',
        headers: { "Authorization": "Bearer api_zptRKxCtFJYHzwQraLnzCvXeOmRbLYLXNk" },
        data: {
          "inputs": {
            "question": question,
            "context": page == 0 ? pageText : document.getElementById("textarea").value
          }
        }
      })
        .then(res => setAnswer(res.data.answer))
    }
  }, [question])

  return (
    <>
      <div className="button-container">
        <button className={`button ${page === 0 ? "button-active" : "button-inactive"}`} onClick={() => setPage(0)}>Scan Webpage</button>
        <button className={`button ${page === 1 ? "button-active" : "button-inactive"}`} onClick={() => setPage(1)}>Manually Enter</button>
      </div>
      <div className="popup-content">
        {page === 0 ?
          <>
            <form className="form">
              <input type="text" id="search0" className="search" placeholder="Enter question" />
              <button type="button" className="submit" onClick={() => setQuestion(document.getElementById("search0").value)}>Search</button>
            </form>
            <hr />
            <p className="answer">{answer}</p>
          </>
          :
          <>
            <form className="form">
              <label>Enter Question</label>
              <input type="text" id="search1" className="search" placeholder="Enter question" />
              <textarea id="textarea" className="textarea" rows={4} placeholder="Enter question" />
              <button type="button" className="submit" onClick={() => setQuestion(document.getElementById("search1").value)}>Search</button>
            </form>
            <p className="answer">{answer}</p>
          </>}
      </div>
    </>
  );
};

export default Popup;
