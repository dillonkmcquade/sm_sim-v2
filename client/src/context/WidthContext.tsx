import { useState, useEffect, createContext, ReactNode } from "react";

export interface WidthContent {
  width: number;
}

export const WidthContext = createContext<WidthContent | null>(null);

export const WidthProvider = ({ children }: {children: ReactNode}) => {
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
