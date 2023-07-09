import { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const cached = window.sessionStorage.getItem("user");
    if (cached) {
      return JSON.parse(cached);
    } else {
      return null;
    }
  });

  useEffect(() => {
    window.sessionStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
