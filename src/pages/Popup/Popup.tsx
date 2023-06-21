import React, { useState, useEffect }  from "react";
import keys from '../../../keys.json'
import logo from "@assets/img/icon-34.png";
import back from './back.svg'
import axios from 'axios';
import "@pages/popup/Popup.css";

// @ts-nocheck

const Popup = () => {

  const [page, setPage] = useState(0)

  const [loading, setLoading] = useState(false)

  const [pageText, setPageText] = useState("")

  const [answer1, setAnswer1] = useState("")
  const [confidence1, setConfidence1] = useState(0)

  const [answer2, setAnswer2] = useState("")
  const [confidence2, setConfidence2] = useState(0)

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

  // Given a question and context, create text to be used in a 
  // request to the OpenAI servers for question answering
  function createPrompt(question: string, text: string) {
    return "Context: " + text + "\n\nQuestion: " + question
  }


  // Format the page text into chunks to be passed to the OpenAI API
  function chunkText(text) {
    var textLength = text.split(" ").length
    if (textLength >= 32000) {
        return ["Too long"]
    }
    // Make the word cutoff 10k words or 2k words depending on how long the context is
    var cutoff = textLength > 6000 ? 10000 : 2000
    var pairs = []
    for(var i = 0; i < Math.ceil(textLength / cutoff); i++) {
        pairs.push(text.split(" ").slice(i * cutoff, (i + 1) * cutoff).join(" "))
    }

    return pairs
  }


  // Returns JSON object with answer and confidence related to a specific question query.
  async function fetchAPI(question: string, context: string, sixteenK: boolean) {
    var modelName = sixteenK ? "gpt-3.5-turbo-16k" : "gpt-3.5-turbo"
    var prompt = createPrompt(question, context)
    var answer = ""
    var confidence = 0

    await axios({
      method: 'POST',
      url: 'https://api.openai.com/v1/chat/completions',
      data: JSON.stringify({
        "model": modelName,
        "messages": [
          {"role": "system", "content": "You are a question answering bot. Answer the question based on the context. Keep the answer short. Only respond with the answer, no other words. Respond \"Unsure about answer\" if not sure about the answer. After your answer, give a confidence rating in your answer separated from the answer with a semicolon. For the confidence, only give a single number, don't say the word \"Confidence\"."},
          {"role": "user", "content": prompt}
        ],
        "temperature": 0,
        "max_tokens": 100,
        "top_p": 1,
        "frequency_penalty": 0.0,
        "presence_penalty": 0.0,
      }),
      headers: {
        'Authorization': `Bearer ${keys.apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(function (res) {
        console.log(res)
        if (res.status == 200) {
          var response = res.data.choices[0].message.content
          answer = response.split("; ").slice(0, -1).join("")
          confidence = parseInt(response.split("; ").slice(-1)[0])
        } else {
          answer = "Unsure about answer"
        }
      })
      .catch(function (err) {
        console.error(err)
        if (err.response.status == 429) {
          answer = "Too many requests, please try again in a minute"
        } else if (err.response.status == 401) {
          answer = "Invalid API key, please contact Chrome Extension creator."
        } else if (err.response.status == 500) {
          answer = "Internal server error, please try again in a minute."
        } else if (err.response.status == 503) {
          answer = "Servers overloaded, please try again later."
        } else {
          answer = "We're sorry, an error has occured"
        }
        confidence = 0
      });

      return {"answer": answer, "confidence": confidence}
  }

  
  // Chunks text, makes calls, and returns answer to user query in JSON object
  async function getAnswer(question: string, context: string) {
    var textChunks = chunkText(context)
    if (textChunks[0] == "Too long") {
      return {"answer": "Context too long, please shorten it", "confidence": 0}
    }

    var topAnswer = {"answer": "", "confidence": -1}
    var sixteenK = textChunks[0].split(" ").length > 2750
    for (const chunk of textChunks) {
      // Get each answer and change the top answer if a better one is found
      var currentAnswer = await fetchAPI(question, chunk, sixteenK)
      if (topAnswer.confidence < currentAnswer.confidence) {
        topAnswer = currentAnswer
      }
    }

    return topAnswer
  }


    // If the search button was pressed make an axios call to the banana
  // dev server with the question and context, then set the answer to the response
  //
  // After the call, if the answer is still an empty string, set it to "Sorry, no answer found"
  //
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
    var topAnswer = await getAnswer(question, pageText)
    .then((topAnswer) => {
      setAnswer1(topAnswer.answer)
      setConfidence1(topAnswer.confidence)
    });


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
    var text = (document.getElementById("textarea") as HTMLInputElement).value
    var topAnswer = await getAnswer(question, text)
    .then((topAnswer) => {
      setAnswer2(topAnswer.answer)
      setConfidence2(topAnswer.confidence)
    });

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
              <label htmlFor="search0">Question testing testing</label>
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
          </>
        );

      case 1:
        return (
          <>
            <form className="form">
              <label htmlFor="search1">Question</label>
              <input type="text" id="search1" className="search" />
              <label htmlFor="textarea">Text To Scan</label>
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
            <p className="explanation">This extension makes use of an artificial intelligence model trained
              to answer  questions based on a given context. It makes use of the <a
                href="https://www.banana.dev/" rel="noreferrer" target="_blank" className="link">banana.dev</a> api to
              perform inference on the model and process the search queries.
            </p>
          </div>
        </>
      }
    </>
  );
};

export default Popup;
