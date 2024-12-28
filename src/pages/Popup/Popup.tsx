import React, { useState, useEffect }  from "react";
import { isWithinTokenLimit } from "gpt-tokenizer/encoding/o200k_base";
import logo from "@assets/img/icon-34.png";
import back from './back.svg'
import axios from 'axios';
import "@pages/popup/Popup.css";


const Popup = () => {
  const TOKEN_LIMIT = 120000;

  const [page, setPage] = useState(0)

  const [loading, setLoading] = useState(false)

  const [pageText, setPageText] = useState("")

  const [answer, setAnswer] = useState("")

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
    } else if (page == 0 && largePageWarning) {
      return "Error, too many words on webpage"
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
    setAnswer("");
    (document.getElementsByClassName("submit")[0] as HTMLButtonElement).disabled = true;
    (document.getElementsByClassName("submit")[0] as HTMLButtonElement).style.cursor = "not-allowed"

    var question = (document.getElementById("search0") as HTMLInputElement).value
    await getAnswer(question, pageText)
    .then(topAnswer => setAnswer(topAnswer));


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
              <label htmlFor="search0">Question</label>
              <input type="text" id="search0" className="search" />
              <button type="submit" className={largePageWarning ? "submit submit-error" : "submit submit-success"}
                onClick={() => tabSearch()}>{getLabel()}</button>
            </form>
            {answer !== "" &&
              <div>
                <hr />
                <p className="answer">{answer}</p>
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