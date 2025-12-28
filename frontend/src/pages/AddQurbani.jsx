import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { QRCodeCanvas } from "qrcode.react";

export default function AddQurbani() {
  const [qrCode, setQrCode] = useState("");
  const [message, setMessage] = useState("");

  const handleAdd = () => {
    const token = uuidv4();
    const qurbaniCode = `QBN-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0")}`;
    setQrCode(`${qurbaniCode}|${token}`);
    setMessage("Qurbani added successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Qurbani</h1>

      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full max-w-md"
      >
        Add Qurbani
      </button>

      {message && <p className="mt-3 text-green-700">{message}</p>}

      {qrCode && (
        <div className="mt-4">
          <QRCodeCanvas value={qrCode} size={180} />
        </div>
      )}
    </div>
  );
}
