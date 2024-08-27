export interface User {
  _id: string;
  email: string;
  password: string;
  __v?: number;
}

export interface Alert {
  _id: string;
  user: string;
  price: number;
  email: string;
  status: "active" | "triggered" | "canceled";
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface TradeData {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  b: number; // Buyer order ID
  a: number; // Seller order ID
  T: number; // Trade time
  m: boolean; // Is the buyer the market maker?
  M: boolean; // Ignore
}
