import { useState, useEffect, createContext } from "react";

export const WidthContext = createContext(null);

export const WidthProvider = ({ children }) => {
  const [width, setWidth] = useState(window.screen.width);

  //conditionally display LineChart bottom axis and change line/pointer size
  useEffect(() => {
    const onWindowResize = () => {
      setWidth(window.screen.width);
    };
    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
  }, []);

  return (
    <WidthContext.Provider value={{ width }}>{children}</WidthContext.Provider>
  );
};
