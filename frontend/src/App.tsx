import AlertsSectionHeader from "./components/AlertsSectionHeader";
import PrimaryButton from "./components/Buttons/PrimaryButton";
import UserCard from "./components/Cards/UserCard";
import { alertData } from "./utils/data";
import { useEffect, useState } from "react";
import Aos from "aos";
import RecentAlert from "./components/Alerts/RecentAlert";
import PingStatus from "./components/pingStatus";
import { AlertColors, AlertTextColors } from "./utils/AlertColors";
import { twMerge } from "tailwind-merge";
import { formatDate } from "./utils/dateFormater";
import AuthModal from "./components/Modals/AuthModal";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <main className="flex gap-2 h-screen">
      <AuthModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
      <section className="flex flex-col gap-2 p-6 w-1/4">
        <PrimaryButton
          title="Create Alert"
          onClick={() => {
            setIsOpen(true);
          }}
        />
        <div className="w-full h-full flex flex-col justify-between">
          <div className="overflow-auto flex flex-col items-start justify-start gap-4 mt-6">
            <h1 className="text-xl text-[#978e8e] font-semibold">
              Recently Updated
            </h1>
            {alertData.slice(0, 4).map((alert, index) => {
              return <RecentAlert alert={alert} index={index} />;
            })}
          </div>
          <UserCard isLoggedIn={true} />
        </div>
      </section>
      <section className="w-full p-6 space-y-8">
        <AlertsSectionHeader />
        <div className="flex flex-wrap gap-2">
          {alertData.map((alert, index) => {
            return (
              <div
                key={index}
                className="flex flex-col bg-[#3a3939] min-w-max w-max h-max rounded-lg p-4 gap-1"
              >
                <div className="w-full flex flex-row justify-between gap-4">
                  <div className="flex gap-2 items-center justify-center">
                    <PingStatus bgColor={AlertColors[alert.status]} />
                    <span
                      className={twMerge(
                        "text-sm",
                        AlertTextColors[alert.status]
                      )}
                    >
                      {alert.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200">
                    {formatDate(alert.updatedAt)}
                  </p>
                </div>
                <h1 className="text-xl font-semibold">{alert.price} USD</h1>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default App;
