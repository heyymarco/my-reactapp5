import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ModalTestApp from './ModalTestApp';
import CheckTestApp from './CheckTestApp';
import InptTestApp from './InputTestApp';
import FormValTestApp from './FormValTestApp';
import JssTestApp from './JssTestApp';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <CheckTestApp />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
