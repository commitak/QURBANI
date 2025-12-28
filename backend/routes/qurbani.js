import express from "express";
import fs from "fs";
import { sendSMS } from "../services/sms.js";

const router = express.Router();
const DB_PATH = "./data/qurbani.json";

// ----------------------------
// Add new Qurbani
// ----------------------------
router.post("/add", (req, res) => {
  const { qurbaniCode, token, name, phone, animal, quantity } = req.body;

  if (!qurbaniCode || !token || !name || !phone || !animal || !quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Read current DB
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));

  // Add new Qurbani
  db.push({
    qurbaniCode,
    token,
    name,
    phone,
    animal,
    quantity,
    status: "PENDING",
  });

  // Save DB
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

  res.json({ message: "Qurbani added successfully" });
});

// ----------------------------
// Scan QR and mark DONE
// ----------------------------
router.post("/scan", async (req, res) => {
  const { qurbaniCode, token } = req.body;

  if (!qurbaniCode || !token) {
    return res.status(400).json({ message: "Invalid QR data" });
  }

  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  const record = db.find(
    (q) => q.qurbaniCode === qurbaniCode && q.token === token
  );

  if (!record) {
    return res.status(404).json({ message: "Invalid QR code" });
  }

  if (record.status === "DONE") {
    return res.status(400).json({ message: "Qurbani already completed" });
  }

  record.status = "DONE";
  record.doneAt = new Date().toISOString();

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

  await sendSMS(record.phone, record.qurbaniCode);

  res.json({ message: "Qurbani marked DONE and SMS sent" });
});

export default router;
