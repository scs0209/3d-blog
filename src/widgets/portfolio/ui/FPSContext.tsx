import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type FPSContextType = {
  fps: number;
  updateFps: (fps: number) => void;
};

const FPSContext = createContext<FPSContextType | undefined>(undefined);

type FPSProviderProps = {
  children: ReactNode;
};

export const FPSProvider = ({ children }: FPSProviderProps) => {
  const [fps, setFps] = useState(60);

  const updateFps = useCallback((newFps: number) => {
    setFps(newFps);
  }, []);

  return <FPSContext.Provider value={{ fps, updateFps }}>{children}</FPSContext.Provider>;
};

export const useFPS = () => {
  const context = useContext(FPSContext);
  if (context === undefined) {
    throw new Error('useFPS must be used within a FPSProvider');
  }
  return context;
};
