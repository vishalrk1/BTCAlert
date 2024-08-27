import React, { useState } from "react";
import PrimaryButton from "../Buttons/PrimaryButton";
import { UserRound } from "lucide-react";
import { twMerge } from "tailwind-merge";
import AuthModal from "../Modals/AuthModal";
import { useAuth } from "../../hooks/useAuth";
import { useAlerts } from "../../hooks/useAlerts";

interface UserCardProp {
  isAuthenticated: boolean;
}

const UserCard: React.FC<UserCardProp> = ({ isAuthenticated }) => {
  const { user, logout } = useAuth();
  const { alerts } = useAlerts();
  const [isOpen, setIsOpen] = useState(false);
  const totalActiveAlerts = isAuthenticated
    ? alerts?.filter((alert) => alert.status === "active").length
    : 100;
    
  return (
    <>
      <AuthModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
      <div
        className={twMerge(
          "flex flex-col gap-2 p-4 pt-6 my-2 space-y-1 bg-[#3a3939] rounded-[12px] w-full text-center border border-zinc-800",
          !isAuthenticated
            ? "justify-center items-center"
            : "justify-center items-start"
        )}
      >
        {!isAuthenticated ? (
          <>
            <h1 className="w-full text-lg font-semibold">
              😎 Login to Explore
            </h1>
            <p className="w-full text-xs font-base text-slate-200 whitespace-pre-line">
              {`Unleash Your Full Potential with \nExclusive Features`}
            </p>
            <PrimaryButton
              className="text-sm"
              title="Register"
              onClick={() => {
                setIsOpen(true);
              }}
            />
          </>
        ) : (
          <>
            <div className="flex gap-3 items-center justify-start">
              <div className="flex items-center justify-center p-2 bg-slate-300 rounded-full">
                <UserRound color="black" size={24} />
              </div>
              <div className="flex flex-col items-start justify-start">
                <h1 className="w-full text-base">{user?.email}</h1>
                <div className="flex gap-2 items-center ">
                  <div className="bg-green-400 w-3 h-3 rounded-full"></div>
                  <p className="text-xs text-green-400">
                    Active Alerts: {totalActiveAlerts}
                  </p>
                </div>
              </div>
            </div>
            <PrimaryButton title="Logout" onClick={logout} />
          </>
        )}
      </div>
    </>
  );
};

export default UserCard;
