import { Alert } from "../../utils/Types";
import PingStatus from "../pingStatus";
import { AlertColors, AlertTextColors } from "../../utils/AlertColors";
import { twMerge } from "tailwind-merge";
import { formatDate } from "../../utils/dateFormater";
import 'aos/dist/aos.css';

interface RecentAlertProps {
  alert: Alert;
  index: number;
}

const RecentAlert: React.FC<RecentAlertProps> = ({ alert, index }) => {

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={100 * index}
      // data-aos-duration={150}
      className="flex flex-col bg-[#3a3939] w-full h-max rounded-lg p-4 gap-1"
    >
      <div className="w-full flex flex-row justify-between">
        <div className="flex gap-2 items-center justify-center">
          <PingStatus bgColor={AlertColors[alert.status]} />
          <span className={twMerge("text-sm", AlertTextColors[alert.status])}>
            {alert.status.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-slate-200">{formatDate(alert.updatedAt)}</p>
      </div>
      <h1 className="text-xl font-semibold">{alert.price} USD</h1>
    </div>
  );
};

export default RecentAlert;
