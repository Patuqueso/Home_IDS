"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useScan } from "@/components/main/ScanContext";
import { usePacket } from "@/components/main/packetProvider";

type PacketLog = {
    src_ip: string;
    dest_ip: string;
    protocol: string;
    timestamp: string;
};

export const LogTable = () => {
    const { isScanning } = useScan();
    const { packet, setPacket } = usePacket();
    const [logs, setLogs] = useState<PacketLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/logs");
            if (!response.ok) throw new Error("Failed to fetch logs");

            const data = await response.json();
            setLogs(data.logs);
            setError(null);
            console.log("Fetched logs:", data.logs);
        } catch (error) {
            console.error("Error fetching logs:", error);
            setError("Failed to fetch logs. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("isScanning:", isScanning);
        let intervalId: any;

        if (isScanning) {
            setLoading(true);
            fetchLogs(); // Fetch immediately when scanning starts
            intervalId = setInterval(() => {
                fetchLogs();
            }, 1000); // 1000 ms = 1 second delay
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isScanning]);

    const getStatusMessage = () => {
        if (!isScanning && logs.length === 0) return "Start scanning to see logs.";
        if (loading) return "Loading logs...";
        if (error) return error;
        if (logs.length === 0) return "No logs available.";
        return null;
    };

    const statusMessage = getStatusMessage();

    return (
        <div className="w-1/2 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Network Logs</h1>
            <div className="w-full [&>div]:max-h-[60dvh] overflow-y-auto border rounded-md">
                <Table className="w-full text-sm text-left">
                    <TableCaption>Latest network logs</TableCaption>
                    <TableHeader className="sticky top-0 z-10 bg-gray-100 border-b">
                        <TableRow>
                            <TableHead className="px-4 py-2">Source IP</TableHead>
                            <TableHead className="px-4 py-2">Destination IP</TableHead>
                            <TableHead className="px-4 py-2">Protocol</TableHead>
                            <TableHead className="px-4 py-2 text-right">Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {statusMessage && logs.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className={`px-4 py-2 text-center ${error ? "text-red-500" : "text-gray-500"}`}
                                >
                                    {statusMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log, index) => (
                                <TableRow
                                    key={index}
                                    className="hover:bg-gray-50 transition-colors hover:cursor-pointer"
                                    onClick={() => packet && setPacket(log)}
                                >
                                    <TableCell className="px-4 py-2">{log.src_ip}</TableCell>
                                    <TableCell className="px-4 py-2">{log.dest_ip}</TableCell>
                                    <TableCell className="px-4 py-2">{log.protocol}</TableCell>
                                    <TableCell className="px-4 py-2 text-right">{log.timestamp}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};