import React, { useState } from "react";
import Modal from "../Modal";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PrimaryButton from "../Buttons/PrimaryButton";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters long" }),
});

type Schema = z.infer<typeof schema>;

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, registerUser, error } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Schema>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Schema) => {
    try {
      if (isLogin) {
        await login(data.email, data.password);
      } else {
        await registerUser(data.email, data.password);
      }

      if (error) {
        toast.error(error);
      } else {
        toast.success(
          isLogin ? "Logged in successfully!" : "Registered successfully!"
        );
        onClose();
      }
    } catch (err) {
      console.error("Authentication error:", err);
      toast.error("Something went wrong. Please try again. 😓");
      onClose();
    }
  };

  return (
    <Modal title="Get Started to set Alerts" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 items-start justify-center gap-3">
          <div>
            <label
              htmlFor="email"
              className="block text-base font-medium text-gray-200"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
              })}
              className="text-white mt-1 block w-full p-2 rounded-lg shadow-sm focus:ring-opacity-40 focus:outline-none focus:border-transparent"
            />
            {errors.email ? (
              <p className="mt-1 text-sm text-primaryLight">
                {errors.email.message}
              </p>
            ) : (
              <p className="invisible mt-1 text-sm text-gray-500">
                Password should be 3 characters long
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-base font-medium text-gray-200"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              {...register("password")}
              className="text-white mt-1 block w-full p-2 rounded-lg shadow-sm focus:ring-opacity-40 focus:outline-none focus:border-transparent"
            />
            {errors.password ? (
              <p className="mt-1 text-sm text-red-400">
                {errors.password.message}
              </p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">
                Password should be 3 characters long
              </p>
            )}
          </div>
          <div>
            <label className="inline-flex items-center space-x-2">
              <input
                type="radio"
                checked={isLogin}
                onClick={() => {
                  setIsLogin(!isLogin);
                }}
                className="appearance-none w-4 h-4  border border-gray-300 rounded-sm checked:bg-primaryLight checked:border-transparent focus:outline-none"
              />
              <span>Already have an account</span>
            </label>
          </div>
        </div>
        {/* Footer */}
        <div className="w-full flex flex-row-reverse items-center gap-3">
          <PrimaryButton title="Cancel" onClick={onClose} className="w-max" />
          <PrimaryButton
            type="submit"
            title={isLogin ? "Continue" : "Create Account"}
            onClick={() => {}}
            className="w-max bg-alert-active hover:bg-[#5bd752]"
          />
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;
