import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import { createStore } from "redux";

const initialState = {
  isLoggedIn: false
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "Login":
      return {
        isLoggedIn: true
      };
    case "Logout":
      return {
        isLoggedIn: false
      };
    default:
      return state;
  }
}

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
