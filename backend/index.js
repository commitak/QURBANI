import express from "express";
import cors from "cors";
import qurbaniRoutes from "./routes/qurbani.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/qurbani", qurbaniRoutes);

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
