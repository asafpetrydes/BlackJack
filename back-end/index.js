import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import models
import { Player } from "./models/Player.js";
import { Table } from "./models/Table.js";
import { Hand } from "./models/Hand.js";
import { HandPlayer } from "./models/HandPlayer.js";

import * as gameController from "./controllers/gameController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✔️ MongoDB connected");
  } catch (err) {
    console.error("⚠️ MongoDB connection error:", err.message);
    console.log("⚠️ Server will continue without database");
  }
}

// ===== HEALTH CHECK ====
app.get("/", (req, res) => {
  res.json({ message: "BlackJack Server Running ✔️" });
});

// ===== PLAYER ROUTES =====
app.get("/api/players", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/players", async (req, res) => {
  try {
    const { name } = req.body;
    const player = await Player.create({ name, balance: 1000 });
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/players/:id", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/players/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== TABLE ROUTES =====
app.get("/api/tables", async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tables", async (req, res) => {
  try {
    const { name, max_players } = req.body;
    const table = await Table.create({ name, max_players: max_players || 4 });
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/tables/:id", async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ error: "Table not found" });
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== GAME LOGIC ROUTES =====
app.post("/api/game/start", gameController.startHand);
app.post("/api/game/hit", gameController.playerHit);
app.post("/api/game/stand", gameController.playerStand);
app.post("/api/game/double-down", gameController.doubleDown);
app.post("/api/game/split", gameController.split);
app.post("/api/game/dealer-play", gameController.dealerPlay);
app.get("/api/game/hand/:hand_id", gameController.getHandStatus);

// ===== START SERVER =====
connectDB();

setTimeout(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}, 1000);