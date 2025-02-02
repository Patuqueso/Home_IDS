import scapy.all as scapy
import json
import threading
import time
import portalocker
from datetime import datetime

captured_packets = []

# Global flag to control sniffing (ensure we start and stop only once)
sniffing = False

# Function to process and log packets
def process_packet(packet, save_callback=None):
    if scapy.IP in packet:
        packet_data = {
            "src_ip": packet[scapy.IP].src,
            "dest_ip": packet[scapy.IP].dst,
            "protocol": "Other",
            "port": None,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        if scapy.TCP in packet:
            packet_data["protocol"] = "TCP"
            packet_data["port"] = packet[scapy.TCP].dport
        elif scapy.UDP in packet:
            packet_data["protocol"] = "UDP"
            packet_data["port"] = packet[scapy.UDP].dport 
        elif scapy.ICMP in packet:
            packet_data["protocol"] = "ICMP"

        captured_packets.append(packet_data)

        if save_callback:
            save_callback(packet_data)

# Start packet capture in a separate thread, ensuring it runs only once
def start_packet_capture(save_callback=None):
    global sniffing
    if sniffing:  # If sniffing is already running, don't start again
        print("[INFO] Packet capture is already running.")
        return

    sniffing = True
    print("[INFO] Starting network sniffing...")
    # Sniff packets in a separate thread to allow stopping
    sniff_thread = threading.Thread(target=lambda: scapy.sniff(prn=lambda pkt: process_packet(pkt, save_callback), store=0, stop_filter=lambda x: not sniffing))
    sniff_thread.start()
    print("[INFO] Sniffing started in background thread")

# Stop packet capture
def stop_packet_capture():
    global sniffing
    if not sniffing:  # If sniffing is not running, don't stop again
        print("[INFO] Packet capture is not running.")
        return

    sniffing = False
    print("[INFO] Stopping packet capture...")
    time.sleep(1)  # Add a delay before stopping sniffing
    print("[INFO] Sniffing stopped")

# Save captured packets to a file with locking
def save_packets_to_file_with_lock(filename="captured_packets.json"):
    with open(filename, 'a') as f:
        portalocker.lock(f, portalocker.LOCK_EX)
        json.dump(captured_packets, f, indent=4)
        portalocker.unlock(f)
    print(f"[INFO] Packets saved to {filename} with locking")
    captured_packets.clear()
