import mongoose, { Document, Schema } from "mongoose";

export enum AlertStatus {
  ACTIVE = "active",
  TRIGGERED = "triggered",
  CANCELED = "canceled",
}

export interface IAlert extends Document {
  user: mongoose.Types.ObjectId;
  price: number;
  email: string;
  status: AlertStatus;
  createdAt: Date;
}

const AlertSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(AlertStatus),
      default: AlertStatus.ACTIVE,
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAlert>("Alert", AlertSchema);
