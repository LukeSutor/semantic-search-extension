import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/icon-34.png'
import axios from 'axios';
import './Popup.css';

const Popup = () => {

  const [page, setPage] = useState(0)

  const [loading, setLoading] = useState(false)

  const [pageText, setPageText] = useState("")

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

  // Get the website's text when the popup is loaded
  useEffect(() => {
    getText()
  }, [])

  // Called after the response has been received from the api
  // If the answer exists in the response, set the answer to it
  // Otherwise, set the answer to no answer found
  function handleResponse(res) {
    if (res.data.answer) {
      setAnswer(res.data.answer)
    } else {
      setAnswer("Sorry, no answer found")
    }
  }


  // If the search button was pressed make an axios call to the hugging 
  // face api and send the question and context then set the answer to the response
  //
  // After the call, if the answer is still an empty string, set it to "Sorry, no answer found"
  // because that means an answer wasn't found.
  //
  // There are different functions to get the answer for each tab, it can be combined into one function
  // but having two functions makes the code more readable and easy to work with.
  async function tabSearch() {
    if (document.getElementById("search0").value == "") {
      document.getElementById("search0").placeholder = "Enter question"
      return
    } else {
      document.getElementById("search0").placeholder = ""
    }

    setLoading(true)
    setAnswer("")
    document.getElementsByClassName("submit")[0].disabled = true;
    document.getElementsByClassName("submit")[0].style.cursor = "not-allowed"

    await axios({
      method: 'POST',
      url: 'https://api.nlpcloud.io/v1/roberta-base-squad2/question',
      headers: { "Authorization": "Token 12535403fad49c32629ea643a5a91c481e767b12" },
      data: {
        "question": document.getElementById("search0").value,
        "context": pageText
      }
    })
      .then(res => handleResponse(res))
      .catch(function(err) {
        console.error(err)
        setAnswer("Too many requests, please try again in a minute")
      })

    document.getElementsByClassName("submit")[0].disabled = false;
    document.getElementsByClassName("submit")[0].style.cursor = "pointer"
    setLoading(false)
  }

  async function textBlockSearch() {
    if (document.getElementById("search1").value == "") {
      document.getElementById("search1").placeholder = "Enter question"
      return
    } else {
      document.getElementById("search1").placeholder = ""
    }

    if (document.getElementById("textarea").value == "") {
      document.getElementById("textarea").placeholder = "Enter text to scan"
      return
    } else {
      document.getElementById("textarea").placeholder = ""
    }

    setLoading(true)
    setAnswer("")
    document.getElementsByClassName("submit")[0].disabled = true;
    document.getElementsByClassName("submit")[0].style.cursor = "not-allowed"

    await axios({
      method: 'POST',
      url: 'https://api.nlpcloud.io/v1/roberta-base-squad2/question',
      headers: { "Authorization": "Token 12535403fad49c32629ea643a5a91c481e767b12" },
      data: {
        "question": document.getElementById("search1").value,
        "context": document.getElementById("textarea").value
      }
    })
      .then(res => handleResponse(res))
      .catch(function(err) {
        console.error(err)
        setAnswer("Too many requests, please try again in a minute")
      })

    document.getElementsByClassName("submit")[0].disabled = false;
    document.getElementsByClassName("submit")[0].style.cursor = "pointer"
    setLoading(false)
  }

  return (
    <>
      <div className="header">
        <img src={logo} alt="" className="logo" />
        <a className="help-button" href="chrome-extension://moknadjgghaffcedafbafjfjgnaanalm/options.html">?
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
              <label for="search0">Question</label>
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
              <label for="search1">Question</label>
              <input type="text" id="search1" className="search" />
              <label for="textarea">Text To Scan</label>
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
