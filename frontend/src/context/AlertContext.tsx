import React, { createContext, ReactNode, useCallback, useEffect } from "react";
import { Alert } from "../utils/Types";
import { useAuth } from "../hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface AlertContextType {
  alerts: Alert[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetchAlert: () => void;
  addAlert: (price: string) => void;
  cancelAlert: (alertId: string) => void;
}

interface AlertContextProviderType {
  children: ReactNode;
  refetchInterval?: number;
}

export const AlertContext = createContext<AlertContextType | undefined>(
  undefined
);

export const AlertContextProvider: React.FC<AlertContextProviderType> = ({
  children,
  refetchInterval = 60000,
}) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  const fetchAlerts = useCallback(async (): Promise<Alert[]> => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/alert`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data.data;
  }, [token]);

  const {
    data: alerts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getAlert"],
    queryFn: fetchAlerts,
    enabled: isAuthenticated,
    refetchInterval: refetchInterval,
  });

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  const refetchAlert = () => {
    queryClient.invalidateQueries({ queryKey: ["getAlert"] });
  };

  const addAlertMutation = useMutation({
    mutationFn: async (price: string) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/alert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price }),
      });
      const data = await res.json();
      return data?.data;
    },
    onSuccess: () => {
      refetchAlert();
      // refetch();
      toast.success("Alert created sucessfully 😎");
    },
    onError: (data) => {
      toast.error(data.message);
    },
  });

  const cancelAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/alert/${alertId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      return data?.data;
    },
    onSuccess: () => {
      // refetchAlert();
      refetch();
      toast.success("Alert canceled sucessfully 🫡");
    },
    onError: (data) => {
      toast.error(data.message);
    },
  });

  const addAlert = async (price: string) => {
    await addAlertMutation.mutateAsync(price);
  };

  const cancelAlert = async (alertId: string) => {
    await cancelAlertMutation.mutateAsync(alertId);
  };

  return (
    <AlertContext.Provider
      value={{ alerts, isLoading, error, refetchAlert, addAlert, cancelAlert }}
    >
      {children}
    </AlertContext.Provider>
  );
};
