import { useAuth } from "../hooks/useAuth";
import PingStatus from "./pingStatus";
import { formatDate } from "../utils/dateFormater";
import { twMerge } from "tailwind-merge";
import { AlertColors, AlertTextColors } from "../utils/AlertColors";

import { demoAlertData } from "../utils/data";
import { useAlerts } from "../hooks/useAlerts";
import PrimaryButton from "./Buttons/PrimaryButton";

const AllAlertList = () => {
  const { isAuthenticated } = useAuth();
  const { alerts, cancelAlert } = useAlerts();

  const displayData = isAuthenticated ? alerts : demoAlertData;

  return (
    <div className="flex flex-wrap gap-4">
      {displayData && displayData.length > 0 ? (
        <>
          {displayData?.map((alert, index) => {
            return (
              <div
                data-aos="fade-up"
                data-aos-delay={50 * index}
                data-aos-once={false}
                key={index}
                className="flex flex-col bg-[#3a3939] min-w-max w-max h-max rounded-lg p-4 gap-2"
              >
                <div
                  className={twMerge(
                    "w-full flex flex-row justify-between",
                    alert.status === "active" ? "gap-12" : "gap-5"
                  )}
                >
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
                <div className="flex flex-row justify-between items-center gap-3">
                  <h1 className="text-xl font-semibold">{alert.price} USD</h1>
                  {alert.status === "active" && (
                    <PrimaryButton
                      title="Cancel"
                      onClick={() => {
                        cancelAlert(alert._id);
                      }}
                      className="w-max text-xs py-1 bg-[#884141]"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <h1 className="text-xl font-semibold">No Alerts Availabel 🧐</h1>
        </div>
      )}
    </div>
  );
};

export default AllAlertList;
