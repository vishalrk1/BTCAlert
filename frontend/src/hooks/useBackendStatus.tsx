import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";

const useBackendStatus = () => {
  const [isActive, setIsActive] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const getStatus = async () => {
      try {
        const res = await fetch(`/api/status`);
        const data = await res.json();
        setIsActive(data.data.status);
        if (!data.data.status) {
          toast.error(data.message || "Backend service is down");
        }
      } catch (error) {
        console.error("Failed to connect to backend:", error);
        toast.error("Failed to connect to backend");
        setIsActive(false);
      }
    };

    if (isAuthenticated) {
      getStatus();
    }
  }, [isAuthenticated]);

  return { isActive: isAuthenticated ? isActive : true };
};

export default useBackendStatus;
