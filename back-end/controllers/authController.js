import { Player } from "../models/Player.js";
import bcryptjs from "bcryptjs";
import { generateToken, setTokenCookie, clearTokenCookie } from "../utils/jwtHandler.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingPlayer = await Player.findOne({ email });
    if (existingPlayer) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const player = await Player.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

    const token = generateToken(player._id);
    setTokenCookie(res, token);

    res.status(201).json({
      message: "Player registered successfully",
      player: { id: player._id, name: player.name, email: player.email, balance: player.balance }
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const player = await Player.findOne({ email });
    if (!player) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, player.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(player._id);
    setTokenCookie(res, token);

    res.json({
      message: "Login successful",
      player: { id: player._id, name: player.name, email: player.email, balance: player.balance }
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const logout = (req, res) => {
  clearTokenCookie(res);
  res.json({ message: "Logged out successfully" });
};

export const getCurrentPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.userId).select("-password");
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch player" });
  }
};
