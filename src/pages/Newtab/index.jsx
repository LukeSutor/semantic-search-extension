import React from 'react';
import { render } from 'react-dom';


render(<Newtab />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
