import { createContext, useState, useEffect, ReactNode } from "react";

export interface Holding {
  quantity: number;
  ticker: string;
  price: number;
}

export interface User {
  _id: string;
  balance: number;
  holdings: Holding[];
  watchList: string[];
  nickname: string;
  name: string;
  picture: string;
  updated_at?: string;
  verified_at?: string;
  sub:string;
  email?: string;
  address?: string;
  telephone?: string;
  timestamp?: Date;
  total?: number;
}
export interface GlobalContent {
  currentUser: User;
  setCurrentUser: React.Dispatch<User | null>; 
}

type Props = {
  children: ReactNode;
}

export const UserContext = createContext<GlobalContent | null>(null);

export const UserProvider = ({ children }: Props) => {
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
