import WebSocket from "ws";
import NodeCache from "node-cache";
import Alert, { AlertStatus, IAlert } from "../models/Alert";

const alertCache = new NodeCache({
  stdTTL: 600, // 10 minutes
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false, // Don't clone objects on get/set
  deleteOnExpire: true, // Delete expired items
  maxKeys: -1, // No limit on number of keys
});

const refreshAlertCache = async (): Promise<void> => {
  try {
    const alerts = await Alert.find({ status: AlertStatus.ACTIVE });

    const alertObjects: { [key: string]: IAlert } = {};
    alerts.forEach((alert) => {
      alertObjects[alert._id.toString()] = alert.toObject();
    });

    alertCache.flushAll();

    // Set each alert individually and log the result
    Object.entries(alertObjects).forEach(([key, value]) => {
      const setResult = alertCache.set(key, value);
    });

    console.log("Alert Cache Refreshed", alertCache.keys().length);
  } catch (error) {
    console.error("Failed to refresh cache:", error);
  }
};

const handelWebSocketMessage = async (data: WebSocket.Data): Promise<void> => {
  const price = parseFloat(JSON.parse(data.toString()).p);
  // console.log(`Current BTC price: $${price.toFixed(2)}`);

  const cachedKeys = alertCache.keys();
  // console.log('Number of cached keys:', cachedKeys.length);

  const cachedAlerts = alertCache.mget(cachedKeys) as { [key: string]: IAlert };
  // console.log('Number of cached alerts:', Object.keys(cachedAlerts).length);

  const triggeredAlerts = Object.values(cachedAlerts).filter((alert) => {
    return alert.price >= price - 0.5 && alert.price <= price + 0.5;
  });

  for (const alert of triggeredAlerts) {
    console.log(
      `Alert triggered for ${alert.email} & ${
        alert.price
      }: Bitcoin has reached $${price.toFixed(2)}`
    );
    alert.status = AlertStatus.TRIGGERED;
    await Alert.findByIdAndUpdate(alert._id, { status: AlertStatus.TRIGGERED });
    alertCache.del(alert._id.toString());
  }
};

const setupWebhook = (): void => {
  const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

  ws.on("open", () => {
    console.log("Connected to Binance WebSocket");
  });

  ws.on("message", handelWebSocketMessage);
  ws.on("error", (error: Error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed. Attempting to reconnect...");
    setTimeout(setupWebhook, 5000);
  });
};

// function to setup webhook
const startWebSocketService = async (): Promise<void> => {
  await refreshAlertCache();
  setupWebhook();

  // refreshing cache every 1 minute
  setInterval(refreshAlertCache, 1 * 60 * 1000);
};

export default startWebSocketService;
