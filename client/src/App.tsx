import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { GlobalStyles } from "./GlobalStyles";

import { useAuth0 } from "@auth0/auth0-react";
import {useCurrentUser} from "./context/UserContext";

import Header from "./components/Header";
import Home from "./pages/Home";
import { CircularProgress } from "@mui/material";

const Menu = lazy(() => import('./components/Menu'));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Research = lazy(() => import("./pages/Research"));
const StockDetails = lazy(() => import("./pages/StockDetails"));
const Transaction = lazy(() => import("./pages/Transaction"));
const Profile = lazy(() => import("./pages/Profile"));

export default function App() {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const { currentUser, setCurrentUser } = useCurrentUser();
  useEffect(() => {
    async function authenticateUser() {
      // create user if does not already exist
      try {
        const { VITE_SERVER_URL } = import.meta.env;
        const accessToken = await getAccessTokenSilently();
        const request = await fetch(`${VITE_SERVER_URL}/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ user }),
        });
        const response = await request.json();
        if (response.status === 200 || response.status === 201) {
          // const total = await getTotalValue(response.data.holdings) || 0;
          setCurrentUser({ ...response.data, timestamp: Date.now() });
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        }
      }
    }
    if (isAuthenticated && !currentUser) {
      authenticateUser();
    }
  }, [getAccessTokenSilently, user, setCurrentUser, isAuthenticated, currentUser]);

  return (
    <>
      <GlobalStyles />
      <Header />
      <Menu />
      <Suspense fallback={<CircularProgress sx={{ color: "#027326" }}/>}>
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
      </Suspense>
    </>
  );
}
