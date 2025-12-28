import { useState } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";

export default function ScanPage() {
  const [status, setStatus] = useState("");
  const [scanning, setScanning] = useState(false);

  const sendSMS = (phone, qurbaniCode) => {
    const message = `English: Your Qurbani (${qurbaniCode}) is DONE.\n` +
                    `Urdu: آپ کی قربانی (${qurbaniCode}) مکمل ہو گئی ہے۔\n` +
                    `Kashmiri: توہیون کی قربانی (${qurbaniCode}) مکمل چھ۔`;

    const smsLink = `sms:${phone}?body=${encodeURIComponent(message)}`;
    window.location.href = smsLink; // opens default messaging app
  };

  const handleScan = async (result) => {
    if (!result || scanning) return;
    setScanning(true);

    try {
      const [qurbaniCode, token] = result.split("|");
      const res = await axios.post("http://localhost:5000/api/qurbani/scan", {
        qurbaniCode,
        token,
      });

      setStatus(res.data.message);

      const phone = res.data.phone; // backend must return donor phone
      if (phone) sendSMS(phone, qurbaniCode);
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.message || "Scan failed");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Mobile Qurbani Scanner</h1>

      <div className="bg-white p-4 rounded shadow w-full max-w-md">
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (!!result) handleScan(result?.text);
          }}
          style={{ width: "100%" }}
        />
      </div>

      {status && (
        <p
          className={`mt-4 font-semibold ${
            status.includes("DONE") ? "text-green-700" : "text-red-600"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}
