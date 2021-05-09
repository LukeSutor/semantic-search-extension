import React, { useState } from 'react';
import './Popup.css';

const Popup = () => {

  const [answer, setAnswer] = useState("dummy data")


  chrome.tabs.query({ active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { method: "getText" }, function (response) {
      if (response.method == "getText") {
        console.log(response)
      }
    });
  });

  return (
    <div className="popup">
      <form className="form">
        <input type="text" className="search" placeholder="Enter question" />
        <button type="submit" className="submit">Search</button>
      </form>
      <hr />
      <p>hello</p>
      <p className="answer">{answer}</p>
    </div>
  );
};

export default Popup;
