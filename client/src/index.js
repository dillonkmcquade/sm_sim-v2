import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { MenuProvider } from "./context/MenuContext";
import { Auth0Provider } from "@auth0/auth0-react";
import { WidthProvider } from "./context/WidthContext";
import { UserProvider } from "./context/UserContext";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Auth0Provider
      domain="dev-twp4lk0d7utxiu7i.us.auth0.com"
      clientId="WiYBN3Xgh7Xb4P92grbyAX1gsET62VHQ"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "my-api",
      }}
    >
      <UserProvider>
        <WidthProvider>
          <MenuProvider>
            <App />
          </MenuProvider>
        </WidthProvider>
      </UserProvider>
    </Auth0Provider>
  </BrowserRouter>
);
