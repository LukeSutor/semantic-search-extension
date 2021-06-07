import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/icon-34.png'
import axios from 'axios';
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


  // If the search button was pressed make an axios call to the hugging 
  // face api and send the question and context then set the answer to the response
  //
  // After the call, if the answer is still an empty string, set it to "Sorry, no answer found"
  // because that means an answer wasn't found.
  //
  // There are different functions to get the answer for each tab, it can be combined into one function
  // but having two functions makes the code more readable and easy to work with.
  function tabSearch() {
    if (document.getElementById("search0").value == "") {
      document.getElementById("search0").placeholder = "Enter question"
      return
    } else {
      document.getElementById("search0").placeholder = ""
    }

    setLoading(true)
    setAnswer("")

    axios({
      method: 'post',
      url: 'https://api-inference.huggingface.co/models/distilbert-base-uncased-distilled-squad',
      headers: { "Authorization": "Bearer api_zptRKxCtFJYHzwQraLnzCvXeOmRbLYLXNk" },
      data: {
        "inputs": {
          "question": document.getElementById("search0").value,
          "context": pageText
        }
      }
    })
      .then(res => setAnswer(res.data.answer))

    setLoading(false)
    if (answer == "") {
      setAnswer("Sorry, no answer found")
    }
  }

  function textBlockSearch() {
    if (document.getElementById("search1").value == "") {
      document.getElementById("search1").placeholder = "Enter question"
      return
    } else {
      document.getElementById("search1").placeholder = ""
    }

    if(document.getElementById("textarea").value == "") {
      document.getElementById("textarea").placeholder = "Enter text to scan"
      return
    } else {
      document.getElementById("textarea").placeholder = ""
    }

    setLoading(true)
    setAnswer("")

    axios({
      method: 'post',
      url: 'https://api-inference.huggingface.co/models/distilbert-base-uncased-distilled-squad',
      headers: { "Authorization": "Bearer api_zptRKxCtFJYHzwQraLnzCvXeOmRbLYLXNk" },
      data: {
        "inputs": {
          "question": document.getElementById("search1").value,
          "context": document.getElementById("textarea").value
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
      <div className="header">
        <img src={logo} alt="" className="logo" />
        <a className="help-button" href="chrome-extension://nhfljbgijklnmmclepalpcikaghkfffe/options.html">?
        </a>
      </div>
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
              <button type="button" className="submit"
                onClick={() => tabSearch()}>{loading ? "Loading..." : "Search"}</button>
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
                onClick={() => textBlockSearch()}>{loading ? "Loading..." : "Search"}</button>
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
