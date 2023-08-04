export interface User {
  id?: string;
  balance: number;
  telephone?: string;
  created_at?: Date;
  total?: number;
  address?: string;
  picture: string;
  name: string;
  nickname: string;
  email: string;
  [key: string]: any;
}

export interface Holding {
  transaction_id: string;
  quantity: number;
  symbol: string;
  price: number;
}

export type Update = Partial<User>;

export interface Ticker {
  symbol: string;
  description: string;
}
