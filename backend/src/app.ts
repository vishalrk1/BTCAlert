import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";

import alertRoutes from "./Routes/alertRoutes";
import authRoutes from "./Routes/autRoutes";
import startWebSocketService from "./services/websocketService";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/alert", alertRoutes);

startWebSocketService();

export default app;
