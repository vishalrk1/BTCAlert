import React from "react";
import Modal from "../Modal";
import { useForm } from "react-hook-form";
import { User } from "../../utils/Types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const form = useForm<User>({
    defaultValues: {
      email: "",
      _id: "",
    },
    mode: "onChange",
  });
  return (
    <Modal title="Login" isOpen={isOpen} onClose={onClose}>
      Hello
    </Modal>
  );
};

export default AuthModal;
