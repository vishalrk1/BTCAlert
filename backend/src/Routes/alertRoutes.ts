import {
  createAlert,
  deleteAlert,
  getAlerts,
  updateAlertStatus,
} from "../controller/alertController";
import express from "express";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticate, createAlert);
router.delete("/:alertId", authenticate, deleteAlert);
router.get("/", authenticate, getAlerts);
router.patch("/:alertId/status", authenticate, updateAlertStatus);

export default router;
