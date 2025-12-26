import { Table } from "../models/Table.js";
import { Hand } from "../models/Hand.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getAllTables = asyncHandler(async (req, res) => {
  const tables = await Table.find().sort({ createdAt: -1 });
  res.json(tables);
});

export const createTable = asyncHandler(async (req, res) => {
  const { name, max_players = 4 } = req.body;

  const table = await Table.create({
    name,
    max_players,
    status: 'ACTIVE'
  });

  res.status(201).json(table);
});

export const getTableById = asyncHandler(async (req, res) => {
  const table = await Table.findById(req.params.id);

  if (!table) {
    res.status(404);
    throw new Error('Table not found');
  }

  res.json(table);
});

export const updateTable = asyncHandler(async (req, res) => {
  const table = await Table.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!table) {
    res.status(404);
    throw new Error('Table not found');
  }

  res.json(table);
});

export const deleteTable = asyncHandler(async (req, res) => {
  const table = await Table.findByIdAndDelete(req.params.id);

  if (!table) {
    res.status(404);
    throw new Error('Table not found');
  }

  res.json({ message: 'Table deleted successfully', table });
});

export const getTablePlayers = asyncHandler(async (req, res) => {
  const table = await Table.findById(req.params.id);

  if (!table) {
    res.status(404);
    throw new Error('Table not found');
  }

  const activeHand = await Hand.findOne({
    table_id: req.params.id,
    status: { $in: ['WAITING', 'ACTIVE', 'DEALER_TURN'] }
  }).populate('player_ids');

  if (!activeHand) {
    return res.json({
      table,
      players: [],
      message: 'No active hand at this table'
    });
  }

  res.json({
    table,
    players: activeHand.player_ids,
    hand_id: activeHand._id
  });
});

