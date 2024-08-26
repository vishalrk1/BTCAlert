import React, { useState, useEffect, ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none ${
        isOpen ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div
        className={`relative w-full max-w-4xl mx-auto ${
          isOpen ? "translate-y-0" : "-translate-y-10"
        } transition-transform duration-300`}
      >
        <div className="relative rounded-xl flex flex-col w-full bg-[#3a3939] border-0 shadow-lg outline-none focus:outline-none">
          {/* Header */}
          <div className="flex items-start justify-between p-5">
            <h3 className="text-2xl font-semibold">{title}</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          {/* Body */}
          <div className="relative p-6 flex-auto overflow-y-auto max-h-[calc(100vh-200px)]">
            {children}
          </div>
          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300">
            <button
              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
