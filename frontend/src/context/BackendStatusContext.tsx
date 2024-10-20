import { createContext, ReactNode, useState } from "react";

interface BackedStausContextType {
  isBackendActive: boolean;
}

interface BackedStausContextProviderType {
  children: ReactNode;
}

export const BackendStatusContext =
  createContext<BackedStausContextType | null>(null);

export const BackendStatusContextProvider = ({
  children,
}: BackedStausContextProviderType) => {
  const [isBackendActive, setIsBackendActive] = useState(true);

  return (
    <BackendStatusContext.Provider value={{ isBackendActive }}>
      {children}
    </BackendStatusContext.Provider>
  );
};
