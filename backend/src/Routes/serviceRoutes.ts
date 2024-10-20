import { Request, Response, Router } from "express";
import startEmailService from "../services/emailService";
import startWebSocketService, {
  stopWebSocketService,
} from "../services/websocketService";

let isServiceUp: boolean = false;
let serviceUpTimeout: NodeJS.Timeout | null = null;

export function stopServices() {
  if (!isServiceUp) {
    return;
  }
  isServiceUp = false;
  stopWebSocketService();

  if (serviceUpTimeout) {
    clearTimeout(serviceUpTimeout);
    serviceUpTimeout = null;
  }

  console.log(">>> Shutting down all services")
}

export function startServices() {
  // if server is already running return
  if (isServiceUp) {
    return;
  }

  // start services
  isServiceUp = true;
  startWebSocketService();
  startEmailService();

  // set timeout of 10min to stop services
  serviceUpTimeout = setTimeout(() => {
    stopServices();
  }, 1 * 60 * 1000);
}

const router = Router();

router.get("/status", (req: Request, res: Response) => {
  res.status(isServiceUp ? 200 : 404).json({
    message: isServiceUp ? "Service is up and running" : "Service is down",
    data: { status: isServiceUp },
  });
});

router.post("/start-service", (req: Request, res: Response) => {
  if (isServiceUp) {
    return res.status(400).json({
      message: "Service is already running",
      data: { status: isServiceUp },
    });
  }

  startServices();

  res.status(200).json({
    message: "Service has been started and will run for 10 minutes",
    data: { status: isServiceUp },
  });
});

export default router;
