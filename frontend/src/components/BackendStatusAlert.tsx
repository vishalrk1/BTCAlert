import PrimaryButton from "./Buttons/PrimaryButton";
import { TriangleAlert } from "lucide-react";

const BackendStatusAlert = () => {
  return (
    <div
      data-aos="fade-up"
      className="flex gap-4 items-center bg-primaryLight/15 p-4 rounded-xl"
    >
      <TriangleAlert size={30} color="#ff9966" />
      <p className="leading-5 font-semibold text-sm">
        {
          "Connection to backed failed, Sorry for inconvenience 😥 looks like our backend services is down. we will get it running soon till then you can contact to us and we will get back to you soon 😁"
        }
      </p>
      <PrimaryButton
        className="bg-primaryLight/50 w-max text-xs"
        title="Contact"
        onClick={() => {}}
      />
    </div>
  );
};

export default BackendStatusAlert;
