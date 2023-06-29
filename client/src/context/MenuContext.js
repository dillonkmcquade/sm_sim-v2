import { createContext, useState, useEffect } from "react";

export const MenuContext = createContext(null);

export const MenuProvider = ({ children }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  useEffect(() => {
    console.log("Menu visible: ", menuVisible);
  }, [menuVisible]);
  return (
    <MenuContext.Provider value={{ menuVisible, setMenuVisible }}>
      {children}
    </MenuContext.Provider>
  );
};
