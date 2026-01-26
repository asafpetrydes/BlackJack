import mongoose from "mongoose";

const handSchema = new mongoose.Schema({
  table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true
  },
  status: {
    type: String,
    enum: ["ACTIVE", "FINISHED"],
    default: "ACTIVE"
  },
  start_time: {
    type: Date,
    default: Date.now
  },
  end_time: Date,
  deck: [Object],
  dealer_cards: [Object],
  player_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player"
  }]
}, { timestamps: true });

export const Hand = mongoose.model("Hand", handSchema);
