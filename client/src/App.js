import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { GlobalStyles } from "./GlobalStyles.js";

import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import StockDetails from "./pages/StockDetails.jsx";
import Research from "./pages/Research.jsx";
import Transaction from "./pages/Transaction.jsx";

import Header from "./components/Header.jsx";
import Menu from "./components/Menu.jsx";

import { MenuContext } from "./context/MenuContext.js";
import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const { menuVisible } = useContext(MenuContext);
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const hasBeenCreated = window.sessionStorage.getItem("user");
    const createUser = async () => {
      // create user if does not already exist
      try {
        const accessToken = await getAccessTokenSilently();
        const request = await fetch("/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ user }),
        });
        const response = await request.json();
        if (response.status === 200 || response.status === 201) {
          window.sessionStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    if (isAuthenticated && !hasBeenCreated) {
      createUser();
    }
  }, [getAccessTokenSilently, isAuthenticated, user]);

  return (
    <>
      <GlobalStyles />
      <Header />
      {menuVisible && <Menu />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/research/:id" element={<StockDetails />} />
        <Route path="/research" element={<Research />} />
        <Route
          path="/transaction/:transactionType/:id"
          element={<Transaction />}
        />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  );
}
