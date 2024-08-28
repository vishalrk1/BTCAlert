import WebSocket from "ws";
import NodeCache from "node-cache";
import Alert, { AlertStatus, IAlert } from "../models/Alert";
import Redis from "ioredis";
import { set } from "mongoose";

const ALERT_CACHE_KEY = "active_alerts";
const EMAIL_QUEUE_KEY = "email_queue";

const redis = new Redis({
  maxRetriesPerRequest: null,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("connect", () => {
  console.info("Redis connected sucessfully!");
});

redis.on("error", () => {
  console.error("Error in loading redis");
});

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
    const activeAlertIds = new Set(alerts.map((alert) => alert._id.toString()));

    const pipeline = redis.pipeline();

    // Remove alerts that are no longer active
    const cachAlertIds = await redis.hkeys(ALERT_CACHE_KEY);
    for (const alerId of cachAlertIds) {
      if (activeAlertIds.has(alerId)) {
        pipeline.hdel(ALERT_CACHE_KEY, alerId);
      }
    }

    // Update or add active alerts
    for (const alert of alerts) {
      pipeline.hset(
        ALERT_CACHE_KEY,
        alert._id.toString(),
        JSON.stringify(alert)
      );
    }

    await pipeline.exec();
    console.log("Alert Cache Refreshed", alertCache.keys().length);
  } catch (error) {
    console.error("Failed to refresh cache:", error);
  }
};

const handelWebSocketMessage = async (data: WebSocket.Data): Promise<void> => {
  const price = parseFloat(JSON.parse(data.toString()).p);
  const cacheAlerts = await redis.hgetall(ALERT_CACHE_KEY);

  const triggeredAlerts: IAlert[] = Object.entries(cacheAlerts)
    .map(([id, alertString]) => ({
      _id: id,
      ...JSON.parse(alertString as string),
    }))
    .filter(
      (alert: IAlert) =>
        alert.price >= price - 0.5 && alert.price <= price + 0.5
    );

  // if triggred alerts are there update alert & add alert id to email queue
  for (const alert of triggeredAlerts) {
    console.log(
      `Alert triggered for ${alert.email} & ${
        alert.price
      }: Bitcoin has reached $${price.toFixed(2)}`
    );
    try {
      await Alert.findByIdAndUpdate(alert._id, {
        status: AlertStatus.TRIGGERED,
      });
      await redis.hdel(ALERT_CACHE_KEY, alert._id.toString());

      // adding alert Id to queue to send email notification
      await redis.zadd(
        EMAIL_QUEUE_KEY,
        Date.now(),
        JSON.stringify({
          email: alert.email,
          subject: "Bitcoin Price Alert",
          body: `Bitcoin has reached $${price.toFixed(2)}`,
        })
      );
    } catch (error) {
      console.error(`Failed to process alert ${alert._id}:`, error);
    }
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
  setInterval(refreshAlertCache, 0.5 * 60 * 1000);
};

export default startWebSocketService;
