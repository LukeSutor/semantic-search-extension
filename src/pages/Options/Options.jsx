import React from 'react';
import './Options.css'

const Options = () => {
  return (
    <>
      <h1 className="header">Help</h1>
      <div className="content">
        <h2 className="subheader">How to search</h2>
        <p className="explanation">This extension has two tabs, "Scan Webpage" and "Manually Enter."
        To parse the text of your current tab to answer your question, use the "Scan Webpage" tab and simply ask the question
        you want answered. If you want to parse a specific block of text for an answer, you can use the "Manually Enter" tab, by
        pasting the text block you want scanned into the "Paste Text to Scan" field, and your question into the "Type Question" field.
        </p>
        <br />
        <h2 className="subheader">How it works</h2>
        <p className="explanation">This extension makes use of an artificial intelligence model called BERT made by Google 
        to answer your questions. It uses the <a 
        href="https://huggingface.co/" rel="noreferrer" target="_blank" className="link">Hugging Face</a> api to utilize the model and process the search queries.
        </p>
        <br />
        <h2 className="subheader">Common Problems</h2>
        <p className="explanation">If the extension says "Sorry, no answer found" after every query, it may be because there is too
        much text than it can process on your current tab. To get around this problem, you could instead copy paste a smaller text block for
        the extension to process instead.
        </p>
        <p className="explanation">If the extension is functioning smoothly, then abruptly stops working, or you navigate to a new page and the extension stops working, 
        you may have to refresh your page, letting the extension recapture your current tab's text, before you proceed.</p>
      </div>
    </>
  )
};

export default Options;