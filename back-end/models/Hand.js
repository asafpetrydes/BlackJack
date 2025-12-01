import mongoose from "mongoose";

const handSchema = new mongoose.Schema({
  table_id: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
  status: { type: String, enum: ["WAITING", "ACTIVE", "DEALER_TURN", "FINISHED"], default: "WAITING" },
  start_time: Date,
  end_time: Date,
  
  // Game state
  deck: [Object], // Array of cards in the deck
  dealer_cards: [Object], // Dealer's cards
  dealer_hidden: Boolean, // Is first dealer card hidden
  
  // Players in this hand (populated via HandPlayer)
  player_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }]
}, { timestamps: true });

export const Hand = mongoose.model("Hand", handSchema);
