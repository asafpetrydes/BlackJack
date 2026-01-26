import { Table } from "../models/Table.js";

export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tables" });
  }
};

export const createTable = async (req, res) => {
  try {
    const { name, max_players = 4 } = req.body;
    const table = await Table.create({ name, max_players });
    res.status(201).json(table);
  } catch (error) {
    res.status(400).json({ error: "Failed to create table" });
  }
};

export const getTableById = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findById(id);
    if (!table) return res.status(404).json({ error: 'Table not found' });
    res.json(table);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch table" });
  }
};

export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findByIdAndUpdate(id, req.body, { new: true });
    if (!table) return res.status(404).json({ error: 'Table not found' });
    res.json(table);
  } catch (error) {
    res.status(500).json({ error: "Failed to update table" });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findByIdAndDelete(id);
    if (!table) return res.status(404).json({ error: 'Table not found' });
    res.json({ deleted: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete table" });
  }
};