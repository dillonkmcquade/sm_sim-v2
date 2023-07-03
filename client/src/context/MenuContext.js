import { createContext, useState } from "react";

export const MenuContext = createContext(null);

export const MenuProvider = ({ children }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <MenuContext.Provider value={{ menuVisible, setMenuVisible }}>
      {children}
    </MenuContext.Provider>
  );
};
