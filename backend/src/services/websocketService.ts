import WebSocket from "ws";
import NodeCache from "node-cache";
import Alert, { AlertStatus, IAlert } from "../models/Alert";
import { addToEmailQueue } from "./emailService";

const ALERT_CACHE_KEY = "active_alerts";
const EMAIL_QUEUE_KEY = "email_queue";

const cache = new NodeCache({
  stdTTL: 600, // 10 minutes
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false, // Don't clone objects on get/set
  deleteOnExpire: true, // Delete expired items
  maxKeys: -1, // No limit on number of keys
});

const refreshAlertCache = async (): Promise<void> => {
  try {
    const alerts = await Alert.find({ status: AlertStatus.ACTIVE });
    const activeAlertIds = new Set(alerts.map((alert) => alert._id.toString()));

    // Remove alerts that are no longer active
    const cachedAlerts =
      cache.get<{ [key: string]: IAlert }>(ALERT_CACHE_KEY) || {};
    for (const alertId in cachedAlerts) {
      if (!activeAlertIds.has(alertId)) {
        delete cachedAlerts[alertId];
      }
    }

    // Update or add active alerts
    for (const alert of alerts) {
      cachedAlerts[alert._id.toString()] = alert.toObject();
    }

    cache.set(ALERT_CACHE_KEY, cachedAlerts);
    console.log("Alert Cache Refreshed", Object.keys(cachedAlerts).length);
  } catch (error) {
    console.error("Failed to refresh cache:", error);
  }
};

const handleWebSocketMessage = async (data: WebSocket.Data): Promise<void> => {
  const price = parseFloat(JSON.parse(data.toString()).p);
  const cachedAlerts =
    cache.get<{ [key: string]: IAlert }>(ALERT_CACHE_KEY) || {};

  const triggeredAlertIds: string[] = [];

  // First, identify all triggered alerts
  Object.entries(cachedAlerts).forEach(([alertId, alert]) => {
    if (alert.price >= price - 0.5 && alert.price <= price + 0.5) {
      triggeredAlertIds.push(alertId);
    }
  });

  // Process triggered alerts
  for (const alertId of triggeredAlertIds) {
    const alert = cachedAlerts[alertId];
    if (!alert) continue; // Skip if alert was already removed

    console.log(
      `Alert triggered for ${alert.email} & ${
        alert.price
      }: Bitcoin has reached $${price.toFixed(2)}`
    );

    try {
      // Remove the alert from cache immediately
      delete cachedAlerts[alertId];
      cache.set(ALERT_CACHE_KEY, cachedAlerts);

      // Update the alert status in the database
      await Alert.findByIdAndUpdate(alert._id, {
        status: AlertStatus.TRIGGERED,
      });

      // Add email to queue
      // addToEmailQueue({
      //   email: alert.email,
      //   subject: "Bitcoin Price Alert",
      //   body: `Bitcoin has reached $${price.toFixed(2)}`,
      // });
    } catch (error) {
      console.error(`Failed to process alert ${alertId}:`, error);
      cachedAlerts[alertId] = alert;
      cache.set(ALERT_CACHE_KEY, cachedAlerts);
    }
  }
};

const setupWebSocket = (): void => {
  const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

  ws.on("open", () => {
    console.log("Connected to Binance WebSocket");
  });

  ws.on("message", handleWebSocketMessage);
  ws.on("error", (error: Error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed. Attempting to reconnect...");
    setTimeout(setupWebSocket, 5000);
  });
};

// Function to setup WebSocket
const startWebSocketService = async (): Promise<void> => {
  await refreshAlertCache();
  setupWebSocket();

  // Refreshing cache every 30 seconds
  setInterval(refreshAlertCache, 30 * 1000);
};

export default startWebSocketService;
