import mongoose from "mongoose";

const handPlayerSchema = new mongoose.Schema({
  hand_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hand", required: true },
  player_id: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },

  bet_amount: { type: Number, default: 0 },
  result: { type: String, enum: ["WIN", "LOSE", "PUSH", "BLACKJACK", "BUST"], default: "PUSH" },
  money_change: { type: Number, default: 0 }
}, { timestamps: true });

export const HandPlayer = mongoose.model("HandPlayer", handPlayerSchema);
