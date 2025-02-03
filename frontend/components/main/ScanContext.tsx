"use client";  // Add this line to indicate this is a client-side component

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface ScanContextType {
  isScanning: boolean;
  setIsScanning: React.Dispatch<React.SetStateAction<boolean>>;  // Type for the setIsScanning function
}

// Create the context
const ScanContext = createContext<ScanContextType>({
  isScanning: false,
  setIsScanning: () => {},
});

interface ScanProviderProps {
  children: ReactNode;  // Type for children prop
}

// Create a provider component to manage the context state
export const ScanProvider: React.FC<ScanProviderProps> = ({ children }) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);

  return (
    <ScanContext.Provider value={{ isScanning, setIsScanning }}>
      {children}
    </ScanContext.Provider>
  );
};

// Custom hook to access the scan context
export const useScan = () => useContext(ScanContext);
