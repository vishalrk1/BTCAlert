import express, { Request, Response } from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";

import alertRoutes from "./Routes/alertRoutes";
import authRoutes from "./Routes/autRoutes";
import startWebSocketService from "./services/websocketService";
import startEmailService from "./services/emailService";

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

app.get("/api/status", (req: Request, res: Response) => {
  const isServiceUp = process.env.KEEP_SERVICE_UP === "true";
  res.status(isServiceUp ? 200 : 404).json({
    message: isServiceUp ? "Service is up and running" : "Service is down",
    data: { status: isServiceUp },
  });
});

if (process.env.KEEP_SERVICE_UP === "true") {
  startWebSocketService();
  startEmailService();
}

export default app;
