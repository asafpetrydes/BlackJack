import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  max_players: { type: Number, default: 4 },
  status: { type: String, default: "ACTIVE" }
}, { timestamps: true });

export const Table = mongoose.model("Table", tableSchema);
