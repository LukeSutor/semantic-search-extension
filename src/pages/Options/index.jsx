import React from 'react';
import { render } from 'react-dom';


render(
  <Options title={'settings'} />,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
