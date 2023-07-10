import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const MenuContext = createContext(null);

export const MenuProvider = ({ children }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setMenuVisible(false);
  }, [location]);
  return (
    <MenuContext.Provider value={{ menuVisible, setMenuVisible }}>
      {children}
    </MenuContext.Provider>
  );
};
