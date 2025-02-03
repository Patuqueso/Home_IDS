"use client";

import { useScan } from "@/components/main/ScanContext"; 
import { Button } from "../ui/button";
import { UniversalSection } from "./Section";

export const Header = () => {
    const { isScanning, setIsScanning } = useScan();

    const handleScan = async () => {
        try {
            // Toggle the scanning state directly
            setIsScanning((prev) => !prev);

            // Send the request to toggle the scan
            const response = await fetch(`http://localhost:5000/api/scan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ toggle: !isScanning }),
            });

            if (!response.ok) {
                throw new Error("Failed to toggle scan");
            }

            const result = await response.json();
            console.log("Scan toggled:", result);

            if (result.status !== "success") {
                throw new Error(
                    result.message ||
                        "Failed to toggle scanning state on the backend"
                );
            }
        } catch (error) {
            console.error("Error toggling scan:", error);
            alert("Failed to toggle scan. Please try again.");
        }
    };

    const handleSave = async () => {};

    return (
        <UniversalSection className="py-5 flex justify-center items-center border">
            <div className="w-1/2 flex justify-start items-center">
                <h1 className="h-fit">Home IDS</h1>
            </div>
            <div className="w-1/2 flex justify-end items-center gap-2">
                <Button
                    onClick={handleScan}
                    variant={isScanning ? "destructive" : "default"}
                >
                    {isScanning ? "Stop Scanning" : "Start Scanning"}
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={!isScanning}
                    variant="secondary"
                >
                    Save Packets
                </Button>
            </div>
        </UniversalSection>
    );
};
