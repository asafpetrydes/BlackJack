import { Player } from "../models/Player.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getAllPlayers = asyncHandler(async (req, res) => {
  const players = await Player.find().sort({ createdAt: -1 });
  res.json(players);
});

export const createPlayer = asyncHandler(async (req, res) => {
  const { name, balance = 1000 } = req.body;

  const player = await Player.create({
    name,
    balance
  });

  res.status(201).json(player);
});

export const getPlayerById = asyncHandler(async (req, res) => {
  const player = await Player.findById(req.params.id);

  if (!player) {
    res.status(404);
    throw new Error('Player not found');
  }

  res.json(player);
});

export const updatePlayer = asyncHandler(async (req, res) => {
  const player = await Player.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!player) {
    res.status(404);
    throw new Error('Player not found');
  }

  res.json(player);
});

export const deletePlayer = asyncHandler(async (req, res) => {
  const player = await Player.findByIdAndDelete(req.params.id);

  if (!player) {
    res.status(404);
    throw new Error('Player not found');
  }

  res.json({ message: 'Player deleted successfully', player });
});

export const getPlayerStats = asyncHandler(async (req, res) => {
  const player = await Player.findById(req.params.id);

  if (!player) {
    res.status(404);
    throw new Error('Player not found');
  }

  const winRate = player.total_hands_played > 0
    ? (player.total_hands_won / player.total_hands_played * 100).toFixed(2)
    : 0;

  res.json({
    player_id: player._id,
    name: player.name,
    balance: player.balance,
    total_hands_played: player.total_hands_played,
    total_hands_won: player.total_hands_won,
    total_hands_lost: player.total_hands_lost,
    win_rate: `${winRate}%`,
  });
});

