import React from 'react';
import back from './back.svg'
import './Options.css'

const Options = () => {
  return (
    <>
      <div className="header">
        <h1 className="header-text">Help</h1>
        <a href="chrome-extension://moknadjgghaffcedafbafjfjgnaanalm/popup.html">
          <img src={back} className="back" alt="back" />
        </a>
      </div>
      <div className="content">
        <h2 className="subheader">How to search</h2>
        <p className="explanation">
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