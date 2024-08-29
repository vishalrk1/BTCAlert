import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";

const useBackendStatus = () => {
  const [isActive, setIsActive] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const getStatus = async () => {
      try {
        const res = await fetch(`/status`);
        setIsActive(res.ok);
      } catch (error) {
        toast.error("Failed to connect to backend");
        setIsActive(false);
      }
    };
    if (isAuthenticated) {
      getStatus();
    }
  }, []);

  return { isActive: isActive };
};

export default useBackendStatus;
