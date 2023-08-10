import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { MenuProvider } from "./context/MenuContext";
import { Auth0Provider } from "@auth0/auth0-react";
import { WidthProvider } from "./context/WidthContext";
import { UserProvider } from "./context/UserContext";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <BrowserRouter>
    <Auth0Provider
      domain={ import.meta.env.VITE_AUTH0_DOMAIN! }
      clientId={ import.meta.env.VITE_AUTH0_CLIENT_ID! }
      useRefreshTokens
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
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
