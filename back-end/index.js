import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { connectDB } from "./config/database.js";
import { initializeWebSocket } from "./services/socketManager.js";
import { setWS } from "./utils/socketEvents.js";
import authRoutes from "./routes/authRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const ws = initializeWebSocket(httpServer);
setWS(ws);

const PORT = process.env.PORT;

app.use(cors({ 
  origin: [process.env.CLIENT_URL],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "BlackJack Server Running ✔️",
    version: "1.0.0",
    websocket: true,
    documentation: `http://localhost:${PORT}/api-docs`
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/game", gameRoutes);

async function startServer() {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
