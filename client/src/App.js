import { useEffect, lazy, Suspense, useContext } from "react";
import { Routes, Route } from "react-router-dom";

import { GlobalStyles } from "./GlobalStyles.js";
import Header from "./components/Header.jsx";
import Menu from "./components/Menu.jsx";

import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";
import { getTotalValue } from "./utils/getTotalValue.js";
import { UserContext } from "./context/UserContext.js";

const Profile = lazy(() => import("./pages/Profile.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const StockDetails = lazy(() => import("./pages/StockDetails.jsx"));
const Research = lazy(() => import("./pages/Research.jsx"));
const Transaction = lazy(() => import("./pages/Transaction.jsx"));

export default function App() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  useEffect(() => {
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
      <Suspense fallback={<CircularProgress />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/research/:id" element={<StockDetails />} />
          <Route path="/research" element={<Research />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/transaction/:transactionType/:id"
            element={<Transaction />}
          />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </Suspense>
    </>
  );
}
