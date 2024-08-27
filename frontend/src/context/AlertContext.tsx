import React, { createContext, ReactNode, useEffect } from "react";
import { Alert } from "../utils/Types";
import { useAuth } from "../hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AlertContextType {
  alerts: Alert[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetchAlert: () => void;
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

  const {
    data: alerts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getAlert"],
    queryFn: async (): Promise<Alert[]> => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/alert`, {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data.data;
    },
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
  return (
    <AlertContext.Provider value={{ alerts, isLoading, error, refetchAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
