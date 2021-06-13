import React from 'react';
import back from './back.svg'
import './Options.css'

const Options = () => {
  return (
    <>
      <div className="header">
        <h1 className="header-text">Help</h1>
        <a href="chrome-extension://nhfljbgijklnmmclepalpcikaghkfffe/popup.html">
          <img src={back} className="back" alt="back" />
        </a>
      </div>
      <div className="content">
        <h2 className="subheader">How to search</h2>
        <p className="explanation">This extension has two tabs, "Scan Webpage" and "Manually Enter."
        To parse the text of your current tab to answer your question, use the "Scan Webpage" tab and simply ask the question
        you want answered. If you want to parse a specific block of text for an answer, you can use the "Manually Enter" tab, by
        pasting the text block you want scanned into the "Text to Scan" field, and your question into the "Question" field.
        </p>
        <br />
        <h2 className="subheader">How it works</h2>
        <p className="explanation">This extension makes use of an artificial intelligence model called RoBERTa made by deepset
        to answer your questions. It uses the <a
            href="https://nlpcloud.io/" rel="noreferrer" target="_blank" className="link">nlpcloud</a> api to 
            utilize the model and process the search queries.
        </p>
      </div>
    </>
  )
};

export default Options;