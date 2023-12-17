import React, { useState, useEffect }  from "react";
import keys from '../../../keys.json'
import logo from "@assets/img/icon-34.png";
import back from './back.svg'
import axios from 'axios';
import "@pages/popup/Popup.css";


const Popup = () => {

  const [page, setPage] = useState(0)

  const [loading, setLoading] = useState(false)

  const [pageText, setPageText] = useState("")

  const [contextText, setContextText] = useState("")

  const [answer1, setAnswer1] = useState("")

  const [answer2, setAnswer2] = useState("")

  const [largePageWarning, setLargePageWarning] = useState(false)

  const [largeContextWarning, setLargeContextWarning] = useState(false)


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


  function handleChange(event) {
    setContextText(event.target.value)    
  }


  // Check if there are over 11k words and the request won't work.
  useEffect(() => {
    if (pageText?.split(" ")?.length > 11000) {
      setLargePageWarning(true);
    } else {
      setLargePageWarning(false);
    }
    if (contextText?.split(" ")?.length > 11000) {
      setLargeContextWarning(true);
    } else {
      setLargeContextWarning(false);
    }
  }, [pageText, contextText])


  // Change pointer and click effects if pageText or contextText is too long
  useEffect(() => {
    if (largePageWarning || largeContextWarning) {
      (document.getElementsByClassName("submit")[0] as HTMLButtonElement).disabled = true;
      (document.getElementsByClassName("submit")[0] as HTMLButtonElement).style.cursor = "not-allowed";
    } else {
      (document.getElementsByClassName("submit")[0] as HTMLButtonElement).disabled = false;
      (document.getElementsByClassName("submit")[0] as HTMLButtonElement).style.cursor = "pointer"
    }
  }, [largePageWarning, largeContextWarning])


  // Gets the button's label based on the current state of the extension
  function getLabel() {
    if (loading) {
      return "Loading..."
    } else if ((page == 0 && largePageWarning) || (page == 1 && largeContextWarning)) {
      return "Limit input to 11,000 words"
    } else {
      return "Search"
    }
  }


  // Given a question and context, create text to be used in a 
  // request to the OpenAI servers for question answering
  function createPrompt(question: string, text: string) {
    return "Question: " + question + "\n\nContext: " + text
  }


  // Returns JSON object with answer related to a specific question query.
  async function getAnswer(question: string, context: string) {
    console.log("Getting answer for question: " + question)
    var textLength = context.split(" ").length
    if (textLength > 11000) {
      return "Context too long, please shorten it"
    }
    var modelName = textLength > 2000 ? "gpt-3.5-turbo-16k" : "gpt-3.5-turbo"

    var prompt = createPrompt(question, context)
    var answer = ""

    // Define the type for your request body
    interface WorkerRequestBody {
      modelName: string;
      prompt: string;
    }

    // Create an instance of the request body
    const requestBody: WorkerRequestBody = {
      modelName: modelName,
      prompt: prompt,
    };

    console.log("Request body: " + JSON.stringify(requestBody))

    // Set the URL of your Cloudflare Worker
    const workerURL: string = 'https://semantic-search.lukesutor.workers.dev/';

    // Make a POST request to the Cloudflare Worker
    await axios.post(workerURL, requestBody)
      .then(response => {
        console.log(response.data.answer);
        answer = response.data.answer;
      })
      .catch(error => {
        answer = "Sorry, no answer found";
        // Handle any error here
        console.error('Error:', error.response?.data || error.message);
    });

    console.log("Answer: " + answer)

    return answer
  }


  // There are different functions to get the answer for each tab, it can be combined into one function
  // but having two functions makes the code more readable and easy to work with.
  async function tabSearch() {
    if ((document.getElementById("search0") as HTMLInputElement).value== "") {
      (document.getElementById("search0") as HTMLInputElement).placeholder = "Enter question"
      return
    } else {
      (document.getElementById("search0") as HTMLInputElement).placeholder = ""
    }

    setLoading(true)
    setAnswer1("");
    (document.getElementsByClassName("submit")[0] as HTMLButtonElement).disabled = true;
    (document.getElementsByClassName("submit")[0] as HTMLButtonElement).style.cursor = "not-allowed"

    var question = (document.getElementById("search0") as HTMLInputElement).value
    await getAnswer(question, pageText)
    .then(topAnswer => setAnswer1(topAnswer));


    (document.getElementsByClassName("submit")[0] as HTMLButtonElement).disabled = false;
    (document.getElementsByClassName("submit")[0] as HTMLButtonElement).style.cursor = "pointer"
    setLoading(false)
  }


  async function textBlockSearch() {
    if ((document.getElementById("search1") as HTMLInputElement).value == "") {
      (document.getElementById("search1") as HTMLInputElement).placeholder = "Enter question"
      return
    } else {
      (document.getElementById("search1") as HTMLInputElement).placeholder = ""
    }

    if ((document.getElementById("textarea") as HTMLInputElement).value == "") {
      (document.getElementById("textarea") as HTMLInputElement).placeholder = "Enter text to scan"
      return
    } else {
      (document.getElementById("textarea") as HTMLInputElement).placeholder = ""
    }

    setLoading(true)
    setAnswer2("");
    (document.getElementsByClassName("submit")[0] as HTMLButtonElement).disabled = true;
    (document.getElementsByClassName("submit")[0] as HTMLButtonElement).style.cursor = "not-allowed"

    var question = (document.getElementById("search1") as HTMLInputElement).value
    await getAnswer(question, contextText)
    .then(topAnswer => setAnswer2(topAnswer));

    (document.getElementsByClassName("submit")[0] as HTMLButtonElement).disabled = false;
    (document.getElementsByClassName("submit")[0] as HTMLButtonElement).style.cursor = "pointer"
    setLoading(false)
  }


  function renderSwitch() {
    switch (page) {
      case 0:
        return (
          <>
            <form className="form">
              <label htmlFor="search0">Question</label>
              <input type="text" id="search0" className="search" />
              <button type="button" className={largePageWarning ? "submit submit-error" : "submit submit-success"}
                onClick={() => tabSearch()}>{getLabel()}</button>
            </form>
            {answer1 !== "" &&
              <div>
                <hr />
                <p className="answer">{answer1}</p>
              </div>
            }
          </>
        );

      case 1:
        return (
          <>
            <form className="form">
              <label htmlFor="search1">Question</label>
              <input type="text" id="search1" className="search" />
              <label htmlFor="textarea">Text To Scan</label>
              <textarea id="textarea" className="textarea" rows={4} onChange={handleChange}/>
              <button type="button" className={largeContextWarning ? "submit submit-error" : "submit submit-success"}
                onClick={() => textBlockSearch()}>{getLabel()}</button>
            </form>
            {answer2 !== "" &&
              <div>
                <hr />
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
            <p className="explanation">This extension makes use of GPT-3.5, an artificial intelligence model trained
              to do a wide variety of natural language processing tasks. It makes use of the <a
                href="https://openai.com/blog/openai-api" rel="noreferrer" target="_blank" className="link">OpenAI API</a> to
              perform inference on the model and process the search queries.
            </p>
          </div>
        </>
      }
    </>
  );
};


export default Popup;