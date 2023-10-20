import React, { MouseEventHandler, SetStateAction } from "react";

interface MenuContent {
  menuVisible: boolean;
  setMenuVisible: React.Dispatch<SetStateAction<boolean>>;
}
interface User {
  id: string;
  balance: number;
  holdings: Holding[];
  watch_list: string[];
  telephone?: string;
  total?: number;
  sub: string;
  address?: string;
  picture: string;
  name: string;
  nickname: string;
  email: string;
}
interface UserContent {
  currentUser: User;
  setCurrentUser: React.Dispatch<SetStateAction<User>>;
}

type Props = {
  children: React.ReactNode;
};

interface Holding {
  quantity: number;
  symbol: string;
  price: number;
}

interface WidthContent {
  width: number;
}
interface Result {
  symbol: string;
  description: string;
}
interface Article {
  id: string;
  publisher: {
    name: string;
    homepage_url: string;
    logo_url: string;
    favicon_url: string;
  };
  title: string;
  author: string;
  article_url: string;
  tickers: string[];
  image_url: string;
  description: string;
  keywords: string[];
}
interface Candle {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  s: string;
  t: number[];
  v: number[];
}
interface Quote {
  c: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
  d: number;
  dp: string;
}
interface ButtonProps {
  handler?: MouseEventHandler<HTMLButtonElement>;
  hovercolor?: string;
  children: React.ReactNode;
  bg?: string;
  hoverbg?: string;
  color?: string;
  bradius?: string;
  border?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

type Update = Partial<User>;
