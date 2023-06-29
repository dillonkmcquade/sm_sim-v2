import Home from "./pages/Home.jsx";
import { Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./GlobalStyles.js";
export default function App() {
  return (
    <div>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}
