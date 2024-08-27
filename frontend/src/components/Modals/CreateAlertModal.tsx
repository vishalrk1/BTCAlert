import React, { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import { TradeData } from "../../utils/Types";
import PrimaryButton from "../Buttons/PrimaryButton";
import toast from "react-hot-toast";

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAlertModal: React.FC<CreateAlertModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [price, setPrice] = useState<string | null>("63668.11");
  const ws = useRef<WebSocket | null>(null);
  const latestPrice = useRef<string | null>(null);
  const [alertPrice, setAlertPrice] = useState<string | null>("");

  useEffect(() => {
    ws.current = new WebSocket(
      "wss://stream.binance.com:9443/ws/btcusdt@trade"
    );
    ws.current.onmessage = (event: MessageEvent) => {
      const data: TradeData = JSON.parse(event.data);
      latestPrice.current = parseFloat(data.p).toFixed(2);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (latestPrice.current !== price) {
        setPrice(latestPrice.current);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [price]);


  return (
    <Modal title="Create New Alert 🔔" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">
          Current Bitcoin Price:{" "}
          <span className="text-alert-active font-bold">$ {price}</span>
        </h1>
        <div className="flex flex-row items-start justify-start gap-4">
          {/* <h1 className="text-xl font-semibold">Set Alert Price </h1> */}
          <div className="flex flex-col gap-1">
            <input
              placeholder="Enter price"
              type="number"
              value={alertPrice?.toString()}
              className="px-4 py-3 rounded-lg shadow-sm"
              onChange={(e) => {
                setAlertPrice(e.target.value);
              }}
            />
            <span
              className="text-xs px-2 hover:cursor-pointer hover:underline"
              onClick={() => {
                setAlertPrice(price);
              }}
            >
              Use current value
            </span>
          </div>
          <PrimaryButton
            type="submit"
            title="Create Alert"
            onClick={() => {}}
            className="w-max bg-alert-active hover:bg-[#5bd752]"
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateAlertModal;
