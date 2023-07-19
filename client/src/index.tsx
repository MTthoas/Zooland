import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import axios from 'axios'
axios.defaults.baseURL = 'http://54.37.68.74:8080';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


