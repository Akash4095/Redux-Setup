import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './modules/app/App'
import configureAppStore from './store/configureStore';

const store = configureAppStore();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App store={store} />
  </React.StrictMode>
);