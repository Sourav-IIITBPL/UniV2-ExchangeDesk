import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { WalletProvider } from "./context/WalletContext";
import { ChainProvider } from "./context/ChainContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <ChainProvider>
          <App />
        </ChainProvider>
      </WalletProvider>
    </BrowserRouter>
  </React.StrictMode>
);
