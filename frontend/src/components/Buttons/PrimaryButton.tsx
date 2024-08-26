import React from "react";

interface ButtonProp {
  title: string;
  onClick: () => void;
}

const PrimaryButton: React.FC<ButtonProp> = ({ title, onClick }) => {
  return (
    <button onClick={onClick} className="w-full bg-[#DC2626] text-white font-semibold rounded-[10px] px-4 py-3 hover:bg-[#ee3e3e]">
      {title}
    </button>
  );
};

export default PrimaryButton;
