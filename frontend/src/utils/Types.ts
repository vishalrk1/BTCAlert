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
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
