import React from "react";
import Modal from "../Modal";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal title="Login" isOpen={isOpen} onClose={onClose}>
      Hello
    </Modal>
  );
};

export default AuthModal;
