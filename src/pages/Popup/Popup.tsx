import React, { useState, useEffect }  from "react";
import { isWithinTokenLimit } from "gpt-tokenizer/encoding/o200k_base";
import logo from "@assets/img/icon-34.png";
import back from './back.svg'
import axios from 'axios';
import "@pages/popup/Popup.css";


const Popup = () => {
  const TOKEN_LIMIT = 120000;
  const MODEL_NAME = "gpt-4o-mini-2024-07-18";

  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [pageText, setPageText] = useState("")
  const [result, setResult] = useState({answer: "", confidence: 0})
  const [largePageWarning, setLargePageWarning] = useState(false)

  // Define interfaces
  interface WorkerRequestBody {
    modelName: string;
    prompt: string;
  }
  interface WorkerResponse {
    answer: string,
    confidence: number
  }

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

  // Check if there are over 120k tokens and the request won't work.
  useEffect(() => {
    if (!isWithinTokenLimit(pageText, TOKEN_LIMIT)) {
      setLargePageWarning(true);
    } else {
      setLargePageWarning(false);
    }
  }, [pageText])


  // Change pointer and click effects if pageText is too long
  useEffect(() => {
    if (largePageWarning) {
      (document.getElementsByClassName("submit")[0] as HTMLButtonElement).disabled = true;
      (document.getElementsByClassName("submit")[0] as HTMLButtonElement).style.cursor = "not-allowed";
    } else {
      (document.getElementsByClassName("submit")[0] as HTMLButtonElement).disabled = false;
      (document.getElementsByClassName("submit")[0] as HTMLButtonElement).style.cursor = "pointer"
    }
  }, [largePageWarning])


  // Gets the button's label based on the current state of the extension
  function getLabel() {
    if (loading) {
      return "Loading..."
    } else if (page == 0 && largePageWarning) {
      return "Error, too many words on webpage"
    } else {
      return "Search"
    }
  }

  // Returns JSON object with answer related to a specific question query.
  async function getResult(question: string, context: string): Promise<WorkerResponse> {
    console.log("Getting answer for question: " + question)
    
    var prompt = `Question: ${question}\n\nContext: ${context}`;
    var result: WorkerResponse;

    const requestBody: WorkerRequestBody = {
      modelName: MODEL_NAME,
      prompt: prompt,
    };

    const workerURL: string = 'https://semantic-search.lukesutor.workers.dev/';

    // Make a POST request to the Cloudflare Worker
    await axios.post(workerURL, requestBody)
      .then(response => {
        console.log(response.data);
        result = response.data;
      })
      .catch(error => {
        result = {answer: "Unsure about answer.", confidence: 0};
        // Handle any error here
        console.error('Error:', error.response?.data || error.message);
    });
    
    return result
  }

  async function tabSearch() {
    if ((document.getElementById("search") as HTMLInputElement).value== "") {
      (document.getElementById("search") as HTMLInputElement).placeholder = "Enter question"
      return
    } else {
      (document.getElementById("search") as HTMLInputElement).placeholder = ""
    }

    setLoading(true);
    setResult({answer: "", confidence: 0});
    (document.getElementsByClassName("submit")[0] as HTMLButtonElement).disabled = true;
    (document.getElementsByClassName("submit")[0] as HTMLButtonElement).style.cursor = "not-allowed"

    var question = (document.getElementById("search") as HTMLInputElement).value
    await getResult(question, pageText)
      .then(result => setResult(result));

    (document.getElementsByClassName("submit")[0] as HTMLButtonElement).disabled = false;
    (document.getElementsByClassName("submit")[0] as HTMLButtonElement).style.cursor = "pointer"
    setLoading(false)
  }


  return (
    <>
      {page === 0 ?
        <>
          <div className="header">
            <img src={logo} alt="" className="logo" />
            <button type="button" className="help-button" onClick={() => setPage(1)}>?
            </button>
          </div>
          <div className="popup-content">
            <form className="form" onSubmit={() => tabSearch()}>
              <label htmlFor="search">Question</label>
              <input type="text" id="search" className="search" />
              <button type="submit" className={largePageWarning ? "submit submit-error" : "submit submit-success"}
                onClick={() => tabSearch()}>{getLabel()}</button>
            </form>
            {result.answer !== "" &&
              <div>
                <hr />
                <p className="confidence">Confidence: {result.confidence}%</p>
                <p className="answer">{result.answer}</p>
              </div>
            }
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
            <p className="explanation">To search your current webpage for answers, simply input your question into the text box and hit search. If your current webpage has too much text, it may be impossible to search due to the limited context size of the AI model.</p>
            <br />
            <h2 className="subheader">How it works</h2>
            <p className="explanation">This extension makes use of GPT-4o-mini, an AI model trained by OpenAI
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