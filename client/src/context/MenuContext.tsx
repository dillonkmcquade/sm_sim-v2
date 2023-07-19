import { createContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";

export interface MenuContent {
  menuVisible: boolean;
  setMenuVisible: React.Dispatch<boolean>;
}

export const MenuContext = createContext<MenuContent | null>(null);

type Props = {
  children: ReactNode;
}
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
