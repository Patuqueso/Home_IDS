"use client";

import { usePacket } from "@/components/main/packetProvider";

type PacketLog = {
    src_ip: string;
    dest_ip: string;
    protocol: string;
    timestamp: string;
};

export const PacketInfo = () => {

    const { packet } = usePacket();

    return (
        <div className="w-1/2">
            <h1 className="text-2xl font-semibold mb-4">Packet Info:</h1>
            <div className="w-full max-w-4xl min-h-[60dvh] bg-red-400 rounded-md">
                {packet.src_ip + 
                packet.dest_ip}
            </div>
        </div>
    );
};
