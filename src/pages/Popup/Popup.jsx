import React, { useState, useEffect } from 'react';
import './Popup.css';

const Popup = () => {

  const [answer, setAnswer] = useState("")

  // Make a request to the content script to fetch the current website's text
  // And set the answer state to that recieved text

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true },
      function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "getText" }, function (response) {
          setAnswer(response)
        });
      });
  }, [])

  return (
    <div className="popup">
      <form className="form">
        <input type="text" className="search" placeholder="Enter question" />
        <button type="submit" className="submit">Search</button>
      </form>
      <hr />
      <p className="answer">{answer !== "" ? answer : "no page text found"}</p>
    </div>
  );
};

export default Popup;
