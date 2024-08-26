import { AlertStatus } from "../models/Alert";
import Alert, { IAlert } from "../models/Alert";
import { Request, Response } from "express";

export const getAlerts = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  try {
    const alerts = await Alert.find({ user: userId }).sort({ updatedAt: -1 });
    res
      .status(200)
      .json({ message: "Successfully fetched all alerts", data: alerts });
  } catch (error) {
    res.status(500).json({
      message: "Cant get alerts, something went wrong",
      error: (error as Error).message,
    });
  }
};

export const createAlert = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  try {
    const alert = new Alert({
      user: userId,
      email: req.user!.email,
      status: AlertStatus.ACTIVE,
      ...req.body,
    });
    alert.save();
    res
      .status(201)
      .json({ message: "Alert created successfully", data: alert });
  } catch (error) {
    res.status(500).json({
      message: "Cant create alert, something went wrong",
      error: (error as Error).message,
    });
  }
};

export const deleteAlert = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { alertId } = req.params;
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: alertId, user: userId },
      { status: AlertStatus.CANCELED },
      { new: true }
    );
    if (!alert) {
      res.status(404).json({ error: "Alert not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Alert Canceled sucessfully", data: alert });
  } catch (error) {
    res.status(500).json({
      message: "Alert not cancled, something went wrong",
      error: (error as Error).message,
    });
  }
};

export const updateAlertStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { alertId } = req.params;
  const { status } = req.body;
  try {
    const alert = await Alert.findOneAndUpdate(
      { user: userId, _id: alertId },
      { status: status },
      { new: true }
    );

    if (!alert) {
      res.status(404).json({ error: "Alert not found" });
      return;
    }

    res.status(200).json({ message: "Alert Updated sucessfully", data: alert });
  } catch (error) {
    res.status(500).json({
      message: "Alert not updated, something went wrong",
      error: (error as Error).message,
    });
  }
};
