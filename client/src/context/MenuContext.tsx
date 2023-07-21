import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MenuContent, Props } from "../types";

export const MenuContext = createContext<MenuContent>({menuVisible: false, setMenuVisible: () => false});

export function MenuProvider({children}: Props) {
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
