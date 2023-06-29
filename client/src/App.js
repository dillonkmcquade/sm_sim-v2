import { Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./GlobalStyles.js";
import Home from "./pages/Home.jsx";
import Header from "./components/Header.jsx";
export default function App() {
  return (
    <div>
      <GlobalStyles />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}
