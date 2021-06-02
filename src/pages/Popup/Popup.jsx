import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './Popup.css';

const Popup = () => {

  const [page, setPage] = useState(0)

  const [loading, setLoading] = useState(false)

  const [pageText, setPageText] = useState("")

  const [question, setQuestion] = useState("")

  const [answer, setAnswer] = useState("")

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

  // If after the axios call the answer is still an empty string, 
  // something went wrong and an answer couldn't be found.
  function checkAnswer() {
    if (answer == "") {
      setAnswer("Sorry, no answer found")
    }
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
      setLoading(true)
      setAnswer("")
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

      setLoading(false)
      if (answer == "") {
        setAnswer("Sorry, no answer found")
      }
    }
  }, [question])

  function handleSubmit() {
    setQuestion(page == 0 ? document.getElementById("search0").value : document.getElementById("search1").value)

    if(question == "") {
      document.getElementById(page == 0 ? "search0" : "search1").placeholder = "Enter question"
      return
    } else {
      document.getElementById(page == 0 ? "search0" : "search1").placeholder = ""
    }

    setLoading(true)
    setAnswer("")
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

    setLoading(false)
    if (answer == "") {
      setAnswer("Sorry, no answer found")
    }
  }

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
              <label for="search0">Type Question</label>
              <input type="text" id="search0" className="search" />
              {/* () => setQuestion(document.getElementById("search0").value) */}
              <button type="button" className="submit"
                onClick={() => handleSubmit()}>{loading ? "Loading..." : "Search"}</button>
            </form>
            {answer !== "" &&
              <>
                <hr />
                <p className="answer">{answer}</p>
              </>
            }
          </>
          :
          <>
            <form className="form">
              <label for="search1">Type Question</label>
              <input type="text" id="search1" className="search" />
              <label for="textarea">Paste Text To Scan</label>
              <textarea id="textarea" className="textarea" rows={4} />
              <button type="button" className="submit"
                onClick={() => setQuestion(document.getElementById("search1").value)}>{loading ? "Loading..." : "Search"}</button>
            </form>
            {answer !== "" &&
              <>
                <hr />
                <p className="answer">{answer}</p>
              </>
            }
          </>}
      </div>
    </>
  );
};

export default Popup;
