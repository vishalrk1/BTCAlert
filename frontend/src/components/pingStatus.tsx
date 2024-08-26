import React from "react";
import { twMerge } from "tailwind-merge";

interface PingStatusProp {
  bgColor: string
}

const PingStatus: React.FC<PingStatusProp> = ({
  bgColor
}) => {
  return (
    <span className="relative flex h-3 w-3">
      <span
        className={twMerge(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          bgColor
        )}
      ></span>
      <span
        className={twMerge(
          "relative inline-flex rounded-full h-3 w-3",
          bgColor
        )}
      ></span>
    </span>
  );
};

export default PingStatus;
