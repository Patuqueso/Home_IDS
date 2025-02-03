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

type PacketLog = {
    src_ip: string;
    dest_ip: string;
    protocol: string;
    timestamp: string;
};

export const Section1 = () => {
    const { isScanning } = useScan();
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

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Network Logs</h1>
            <div className="w-full [&>div]:max-h-[60dvh] overflow-y-auto border rounded-md">
                <Table className="w-full text-sm text-left">
                    <TableCaption>Latest network logs</TableCaption>
                    <TableHeader className="sticky top-0 z-10 bg-gray-100 border-b">
                        <TableRow>
                            <TableHead className="px-4 py-2">
                                Source IP
                            </TableHead>
                            <TableHead className="px-4 py-2">
                                Destination IP
                            </TableHead>
                            <TableHead className="px-4 py-2">
                                Protocol
                            </TableHead>
                            <TableHead className="px-4 py-2 text-right">
                                Timestamp
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="px-4 py-2 text-center text-gray-500"
                                >
                                    Loading logs...
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="px-4 py-2 text-center text-red-500"
                                >
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : logs.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="px-4 py-2 text-center text-gray-500"
                                >
                                    No logs available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log, index) => (
                                <TableRow
                                    key={index}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <TableCell className="px-4 py-2">
                                        {log.src_ip}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        {log.dest_ip}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        {log.protocol}
                                    </TableCell>
                                    <TableCell className="px-4 py-2 text-right">
                                        {log.timestamp}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
