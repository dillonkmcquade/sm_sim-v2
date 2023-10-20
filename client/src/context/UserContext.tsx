import { createContext, useState, useEffect } from "react";
import { Props, UserContent, User } from "../types";

export const UserContext = createContext<UserContent | null>(null);

export const UserProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
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
