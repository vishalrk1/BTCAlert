import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProp {
  title: string;
  onClick: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const PrimaryButton: React.FC<ButtonProp> = ({
  title,
  onClick,
  className,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={twMerge(
        "w-full bg-primary text-white font-semibold rounded-[10px] px-4 py-3 hover:bg-primaryLight",
        className
      )}
    >
      {title}
    </button>
  );
};

export default PrimaryButton;
