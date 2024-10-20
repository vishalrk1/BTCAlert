import express, { Request, Response } from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";

import alertRoutes from "./Routes/alertRoutes";
import authRoutes from "./Routes/autRoutes";
import serviceRoutes, { startServices } from "./Routes/serviceRoutes";

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
app.use("/api/service", serviceRoutes);

if (process.env.KEEP_SERVICE_UP === "true") {
  startServices();
}

export default app;
