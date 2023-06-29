// Provides user context across application for adding/deleting items and checkout
import { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // This identifies the user by its cartId
    const user = window.localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return null;
  });
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
