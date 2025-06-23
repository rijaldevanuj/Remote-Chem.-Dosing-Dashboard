import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
 
    </BrowserRouter>
  </React.StrictMode>
);

// If you are not using reportWebVitals, remove or comment out the following line:
// reportWebVitals();

// If you want to use it, uncomment the import and usage:
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();
