import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { GlobalStyles } from "./GlobalStyles";

import { useAuth0 } from "@auth0/auth0-react";
import { getTotalValue } from "./utils/utils";
import {useCurrentUser} from "./context/UserContext";

import Header from "./components/Header";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import StockDetails from "./pages/StockDetails";
import Research from "./pages/Research";
import Transaction from "./pages/Transaction";
import Profile from "./pages/Profile";
import { Navigate } from "react-router-dom";

export default function App() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const { currentUser, setCurrentUser } = useCurrentUser();
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
      } catch (err) {
        if (err instanceof Error){
          console.error(err.message);
        }
      }
    };
    if (isAuthenticated && !currentUser) {
      createUser();
    }
  }, [getAccessTokenSilently, isAuthenticated, user, currentUser, setCurrentUser]);

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
