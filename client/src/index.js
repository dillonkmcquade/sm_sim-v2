import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MenuProvider } from "./context/MenuContext";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain="dev-twp4lk0d7utxiu7i.us.auth0.com"
        clientId="WiYBN3Xgh7Xb4P92grbyAX1gsET62VHQ"
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <MenuProvider>
          <App />
        </MenuProvider>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);
