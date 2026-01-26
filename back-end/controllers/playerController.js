import { Player } from "../models/Player.js";

export const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find().select("-password");
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch players" });
  }
};

export const getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findById(id).select("-password");
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch player" });
  }
};

export const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (req.userId !== id) {
      return res.status(403).json({ error: "Not authorized to update this player" });
    }

    const updateData = {};
    if (name) {
      updateData.name = name;
    }

    const player = await Player.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    if (!player) return res.status(404).json({ error: "Player not found" });
    
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Failed to update player" });
  }
};

export const getMyStats = async (req, res) => {
  try {
    const player = await Player.findById(req.userId).select("-password");
    if (!player) return res.status(404).json({ error: "Player not found" });
    
    res.json({
      id: player._id,
      name: player.name,
      email: player.email,
      balance: player.balance
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};