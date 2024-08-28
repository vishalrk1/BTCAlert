import { useState } from "react";
import CreateAlertModal from "../components/Modals/CreateAlertModal";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import UserCard from "../components/Cards/UserCard";
import AlertsSectionHeader from "../components/AlertsSectionHeader";
import { useAuth } from "../hooks/useAuth";
import AllAlertList from "../components/AllAlertList";
import RecentAlert from "../components/Alerts/RecentAlert";
import { demoAlertData } from "../utils/data";
import { useAlerts } from "../hooks/useAlerts";
import toast from "react-hot-toast";

const Homepage = () => {
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const { alerts } = useAlerts();

  const displayData = isAuthenticated
    ? alerts?.slice(0, 4)
    : demoAlertData?.slice(0, 2);

  return (
    <main className="flex gap-2 h-screen">
      <CreateAlertModal
        isOpen={openAlertModal}
        onClose={() => {
          setOpenAlertModal(false);
        }}
      />
      <section className="flex flex-col gap-2 p-6 w-1/4">
        <PrimaryButton
          title="Create Alert 🔔"
          onClick={() => {
            if (isAuthenticated) {
              setOpenAlertModal(true);
            } else {
              toast("Login To continue", { icon: "⚠️" });
            }
          }}
        />
        <div className="w-full h-full flex flex-col justify-between">
          <div className="flex flex-col items-start justify-start gap-4 mt-4">
            <h1 className="text-xl text-[#978e8e] font-semibold">
              Recently Updated
            </h1>
            {displayData?.map((alert, index) => {
              return <RecentAlert alert={alert} index={index} />;
            })}
          </div>
          <UserCard isAuthenticated={isAuthenticated} />
        </div>
      </section>
      <section className="w-full p-6 space-y-8">
        <AlertsSectionHeader />
        <AllAlertList />
      </section>
    </main>
  );
};

export default Homepage;
