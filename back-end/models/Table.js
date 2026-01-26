import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  max_players: {
    type: Number,
    default: 4,
    min: 1,
    max: 7
  },
  min_bet: {
    type: Number,
    default: 10
  },
  max_bet: {
    type: Number,
    default: 1000
  }
}, { timestamps: true });

export const Table = mongoose.model("Table", tableSchema);
