import { useEffect, useContext } from "react";
import { Routes, Route } from "react-router-dom";

import { GlobalStyles } from "./GlobalStyles.js";

import { useAuth0 } from "@auth0/auth0-react";
import { getTotalValue } from "./utils/getTotalValue.js";
import { UserContext } from "./context/UserContext.js";

import Header from "./components/Header.jsx";
import Menu from "./components/Menu.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import StockDetails from "./pages/StockDetails.jsx";
import Research from "./pages/Research.jsx";
import Transaction from "./pages/Transaction.jsx";
import Profile from "./pages/Profile.jsx";
import { Navigate } from "react-router-dom";

export default function App() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  useEffect(() => {
    const createUser = async () => {
      // create user if does not already exist
      try {
        const { REACT_APP_SERVER_URL } = process.env;
        const accessToken = await getAccessTokenSilently();
        const request = await fetch(`${REACT_APP_SERVER_URL}/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ user }),
        });
        const response = await request.json();
        if (response.status === 200 || response.status === 201) {
          const total = await getTotalValue(response.data.holdings);
          setCurrentUser({ ...response.data, total, timestamp: Date.now() });
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    if (isAuthenticated && !currentUser) {
      createUser();
    }
  }, [getAccessTokenSilently, isAuthenticated, user, currentUser]);

  return (
    <>
      <GlobalStyles />
      <Header />
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/research/:id" element={<StockDetails />} />
        <Route path="/research" element={<Research />} />

        {/*Login Required */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/transaction/:transactionType/:id"
          element={isAuthenticated ? <Transaction /> : <Navigate to="/" />}
        />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  );
}
