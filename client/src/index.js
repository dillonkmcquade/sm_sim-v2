import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MenuProvider } from "./context/MenuContext";
import { UserProvider } from "./context/UserContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <MenuProvider>
          <App />
        </MenuProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
