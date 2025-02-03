"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type PacketLog = {
    src_ip: string;
    dest_ip: string;
    protocol: string;
    timestamp: string;
};

// Define the context type
interface PacketContextType {
    packet: PacketLog;
    setPacket: React.Dispatch<React.SetStateAction<PacketLog>>;
}

// Create the context
const PacketContext = createContext<PacketContextType>({
    packet: {
        src_ip: "",
        dest_ip: "",
        protocol: "",
        timestamp: "",
    },
    setPacket: () => {},
});

interface PacketProviderProps {
    children: ReactNode;
}

// Create a provider component to manage the context state
export const PacketProvider: React.FC<PacketProviderProps> = ({ children }) => {
    // Provide a default PacketLog structure to avoid undefined issues
    const [packet, setPacket] = useState<PacketLog>({
        src_ip: "",
        dest_ip: "",
        protocol: "",
        timestamp: "",
    });

    return (
        <PacketContext.Provider value={{ packet, setPacket }}>
            {children}
        </PacketContext.Provider>
    );
};

// Custom hook to access the scan context
export const usePacket = () => useContext(PacketContext);
