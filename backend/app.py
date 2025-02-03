from flask import Flask, request, jsonify
from packets import start_packet_capture, stop_packet_capture, save_packets_to_file_with_lock
from packets import captured_packets 
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route('/api/scan', methods=['POST'])
def toggle_scan():
    toggle = request.json.get("toggle", False)
    try:
        if toggle:
            start_packet_capture(save_callback=None)
        else:
            stop_packet_capture()

        return jsonify({"scanning": toggle, "status": "success"}), 200  # Ensure this is the correct structure
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/save_packets', methods=['POST'])
def save_packets():
    try:
        save_packets_to_file_with_lock()  # Save packets to file
        return jsonify({"status": "success", "message": "Packets saved successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/logs', methods=['GET'])
def get_logs():
    # Assuming captured_packets is the list where logs are stored
    return jsonify({"logs": captured_packets}), 200


if __name__ == "__main__":
    app.run(debug=True)
