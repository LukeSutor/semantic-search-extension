import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/icon-34.png'
import back from './back.svg'
import axios from 'axios';
import './Popup.css';

const Popup = () => {

  const [page, setPage] = useState(0)

  const [loading, setLoading] = useState(false)

  const [pageText, setPageText] = useState("")

  const [answer1, setAnswer1] = useState("")
  const [confidence1, setConfidence1] = useState("")

  const [answer2, setAnswer2] = useState("")
  const [confidence2, setConfidence2] = useState("")

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
    setAnswer1("")
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
      .then(function (res) {
        if (res.data.answer) {
          setAnswer1(res.data.answer)
          setConfidence1(Math.floor(res.data.score * 10000) / 100)

          // Highlight the text on the page
          // Doesn't work, commented out for now
          // chrome.tabs.query({ active: true, currentWindow: true },
          //   function (tabs) {
          //     chrome.tabs.sendMessage(tabs[0].id, { type: "highlight", search: res.data.answer });
          //   });
        } else {
          setAnswer1("Sorry, no answer found")
        }
      })
      .catch(function (err) {
        console.error(err)
        if (err.response.status == 502) {
          setAnswer1("Max word count exceeded, please search smaller text section");
        } else if (err.response.status == 429) {
          setAnswer1("Too many requests, please try again in a minute");
        } else if (err.response.status == 422) {
          setAnswer1("Please refresh your webpage and try again");
        } else {
          setAnswer1("We're sorry, an error has occured");
        }
        setConfidence1(0)
      })


    document.getElementsByClassName("submit")[0].disabled = false
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
    setAnswer2("")
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
      .then(function (res) {
        if (res.data.answer) {
          setAnswer2(res.data.answer)
          setConfidence2(Math.floor(res.data.score * 10000) / 100)
        } else {
          setAnswer2("Sorry, no answer found")
        }
      })
      .catch(function (err) {
        console.error(err)
        if (err.response.status == 502) {
          setAnswer2("Max word count exceeded, please search smaller text section");
        } else if (err.response.status == 429) {
          setAnswer2("Too many requests, please try again in a minute");
        } else if (err.response.status == 422) {
          setAnswer2("Please refresh your webpage and try again");
        } else {
          setAnswer2("We're sorry, an error has occured");
        }
        setConfidence2(0)
      })

    document.getElementsByClassName("submit")[0].disabled = false;
    document.getElementsByClassName("submit")[0].style.cursor = "pointer"
    setLoading(false)
  }

  function renderSwitch() {
    switch (page) {
      case 0:
        return (
          <>
            <form className="form">
              <label for="search0">Question</label>
              <input type="text" id="search0" className="search" />
              <button type="button" className="submit"
                onClick={() => tabSearch()}>{loading ? "Loading..." : "Search"}</button>
            </form>
            {answer1 !== "" &&
              <div>
                <hr />
                <label className="confidence">{confidence1 == 0 ? "" : `Confidence: ${confidence1}%`}</label>
                <p className="answer">{answer1}</p>
              </div>
            }
            {/* <p>{pageText}</p> */}
          </>
        );

      case 1:
        return (
          <>
            <form className="form">
              <label for="search1">Question</label>
              <input type="text" id="search1" className="search" />
              <label for="textarea">Text To Scan</label>
              <textarea id="textarea" className="textarea" rows={4} />
              <button type="button" className="submit"
                onClick={() => textBlockSearch()}>{loading ? "Loading..." : "Search"}</button>
            </form>
            {answer2 !== "" &&
              <div>
                <hr />
                <label className="confidence">{confidence2 == 0 ? "" : `Confidence: ${confidence2}%`}</label>
                <p className="answer">{answer2}</p>
              </div>
            }
          </>
        );

      default:
        break;
    }
  }

  return (
    <>
      {page !== 2 ?
        <>
          <div className="header">
            <img src={logo} alt="" className="logo" />
            <button type="button" className="help-button" onClick={() => setPage(2)}>?
            </button>
          </div>
          <div className="button-container">
            <button className={`button ${page === 0 ? "button-active" : "button-inactive"}`} onClick={() => setPage(0)}>Scan Webpage</button>
            <button className={`button ${page === 1 ? "button-active" : "button-inactive"}`} onClick={() => setPage(1)}>Manually Enter</button>
          </div>
          <div className="popup-content">
            {renderSwitch()}
          </div>
        </>
        :
        <>
          <div className="header-help">
            <h1 className="header-text-help">Help</h1>
            <button type="button" className="back-button" onClick={() => setPage(0)}>
              <img src={back} className="back" alt="back" />
            </button>
          </div>
          <div className="content">
            <h2 className="subheader">How to search</h2>
            <p className="explanation">This extension has two tabs, "Scan Webpage" and "Manually Enter." To parse the text of your
              current tab to answer your question, use the "Scan Webpage" tab and simply ask the question you want answered. If you
              want to parse a specific block of text for an answer, you can use the "Manually Enter" tab, by pasting the text block
              you want scanned into the "Text to Scan" field, and your question into the "Question" field.</p>
            <br />
            <h2 className="subheader">How it works</h2>
            <p className="explanation">This extension makes use of an artificial intelligence model called RoBERTa made by deepset
              to answer your questions. It uses the <a
                href="https://nlpcloud.io/" rel="noreferrer" target="_blank" className="link">nlpcloud</a> api to
              utilize the model and process the search queries.
            </p>
          </div>
        </>
      }
    </>
  );
};

export default Popup;
