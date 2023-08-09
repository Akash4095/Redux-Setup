import React from "react";
import { Provider } from "react-redux";
import MainContent from "./mainContent";
import "./App.css";

function App({ store }) {
  return (
    <Provider store={store} >
      <MainContent />
    </Provider>
  );
}

export default App;
