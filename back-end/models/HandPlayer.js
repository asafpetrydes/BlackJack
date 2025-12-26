import mongoose from "mongoose";

const handPlayerSchema = new mongoose.Schema({
  hand_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hand",
    required: true,
    index: true
  },
  player_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
    index: true
  },
  bet_amount: {
    type: Number,
    default: 0,
    min: [0, 'Bet amount cannot be negative']
  },
  cards: {
    type: [Object],
    default: []
  },
  hand_value: {
    type: Number,
    default: 0,
    min: 0,
    max: 31
  },
  status: {
    type: String,
    enum: ["ACTIVE", "STAND", "HIT", "BUST", "BLACKJACK"],
    default: "ACTIVE"
  },
  result: {
    type: String,
    enum: ["WIN", "LOSE", "PUSH", "BLACKJACK", "BUST", null],
    default: null
  },
  money_change: {
    type: Number,
    default: 0
  },
  payout: {
    type: Number,
    default: 0,
    min: 0
  }
}, { timestamps: true });

handPlayerSchema.index({ hand_id: 1, player_id: 1 });
handPlayerSchema.index({ player_id: 1, createdAt: -1 });

export const HandPlayer = mongoose.model("HandPlayer", handPlayerSchema);
