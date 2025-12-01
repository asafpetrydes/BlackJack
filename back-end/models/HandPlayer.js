import mongoose from "mongoose";

const handPlayerSchema = new mongoose.Schema({
  hand_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hand", required: true },
  player_id: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },

  bet_amount: { type: Number, default: 0 },
  cards: [Object], // Array of cards in player's hand
  hand_value: { type: Number, default: 0 }, // Calculated hand value
  status: { type: String, enum: ["ACTIVE", "STAND", "HIT", "BUST", "BLACKJACK"], default: "ACTIVE" },
  
  result: { type: String, enum: ["WIN", "LOSE", "PUSH", "BLACKJACK", "BUST"], default: null },
  money_change: { type: Number, default: 0 }, // Profit/loss for this hand
  payout: { type: Number, default: 0 } // Total payout (bet + winnings)
}, { timestamps: true });

export const HandPlayer = mongoose.model("HandPlayer", handPlayerSchema);
