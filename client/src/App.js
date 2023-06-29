import { Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./GlobalStyles.js";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Header from "./components/Header.jsx";
import Menu from "./components/Menu.jsx";
import { MenuContext } from "./context/MenuContext.js";
import { useContext } from "react";
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
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  );
}
