import { useContext } from "react";
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

export default function App() {
  const { menuVisible } = useContext(MenuContext);

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
        <Route path="/transaction/:id" element={<Transaction />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  );
}
