import { Alert, User } from "./Types";

export const UserData: User = {
  _id: "66cb887e60f6a4a1487b64a8",
  email: "test@gmail.com",
  password: "$2b$10$GOteC9aVrd2/lYaKlzrSMOv6NZ2uyx6rPo26j34IW6lCNemdrlyO.",
  __v: 0,
};

export const demoAlertData = [
  {
    _id: "66ccb812441c03c59700064d",
    user: "66cb887e60f6a4a1487b64a8",
    price: 63662.1,
    email: "test@gmail.com",
    status: "triggered",
    createdAt: "2024-08-26T17:14:58.579Z",
    updatedAt: "2024-08-26T17:18:57.101Z",
    __v: 0,
  },
  {
    _id: "66ccb8fc4a57937129bb65ac",
    user: "66cb887e60f6a4a1487b64a8",
    price: 63680.1,
    email: "test@gmail.com",
    status: "active",
    createdAt: "2024-08-26T17:18:52.411Z",
    updatedAt: "2024-08-26T17:18:52.411Z",
    __v: 0,
  },
  {
    _id: "66ccb819441c03c59700064f",
    user: "66cb887e60f6a4a1487b64a8",
    price: 63663.1,
    email: "test@gmail.com",
    status: "canceled",
    createdAt: "2024-08-26T17:15:05.874Z",
    updatedAt: "2024-08-26T17:18:41.169Z",
    __v: 0,
  },
] as Alert[];
