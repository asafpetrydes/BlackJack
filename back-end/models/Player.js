import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  balance: { type: Number, default: 0 },
  total_hands_played: { type: Number, default: 0 },
  total_hands_won: { type: Number, default: 0 },
  total_hands_lost: { type: Number, default: 0 }
}, { timestamps: true });

export const Player = mongoose.model("Player", playerSchema);
