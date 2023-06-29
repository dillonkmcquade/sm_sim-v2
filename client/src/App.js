import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./GlobalStyles";
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

export default App;
