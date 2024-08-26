import React from "react";
import PrimaryButton from "../Buttons/PrimaryButton";
import { UserRound } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface UserCardProp {
  isLoggedIn: boolean;
}

const UserCard: React.FC<UserCardProp> = ({ isLoggedIn }) => {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-2 p-4 pt-6 space-y-2 bg-[#3a3939] rounded-[12px] w-full text-center border border-zinc-800",
        !isLoggedIn
          ? "justify-center items-center"
          : "justify-center items-start"
      )}
    >
      {!isLoggedIn ? (
        <>
          <h1 className="w-full text-lg font-semibold">😎 Login to Explore</h1>
          <p className="w-full text-xs font-base text-slate-200 whitespace-pre-line">
            {`Unleash Your Full Potential with \nExclusive Features`}
          </p>
          <PrimaryButton title="Register" onClick={() => {}} />
        </>
      ) : (
        <>
          <div className="flex gap-3 items-center justify-start">
            <div className="flex items-center justify-center p-2 bg-slate-300 rounded-full">
              <UserRound color="black" size={24} />
            </div>
            <div className="flex flex-col items-start justify-start">
              <h1 className="w-full text-base">Test@gmail.com</h1>
              <div className="flex gap-2 items-center ">
                <div className="bg-green-400 w-3 h-3 rounded-full"></div>
                <p className="text-xs text-green-400">Active Alerts: 100</p>
              </div>
            </div>
          </div>
          <PrimaryButton title="Logout" onClick={() => {}} />
        </>
      )}
    </div>
  );
};

export default UserCard;
