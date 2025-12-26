import mongoose from "mongoose";

const handSchema = new mongoose.Schema({
  table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ["WAITING", "ACTIVE", "DEALER_TURN", "FINISHED"],
    default: "WAITING"
  },
  start_time: {
    type: Date,
    default: Date.now
  },
  end_time: Date,
  deck: [Object],
  dealer_cards: {
    type: [Object],
    default: []
  },
  dealer_hidden: {
    type: Boolean,
    default: true
  },
  player_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player"
  }]
}, { timestamps: true });

handSchema.index({ table_id: 1, status: 1 });
handSchema.index({ createdAt: -1 });

handSchema.virtual('duration').get(function() {
  if (!this.end_time) return null;
  return Math.round((this.end_time - this.start_time) / 1000);
});

handSchema.set('toJSON', { virtuals: true });
handSchema.set('toObject', { virtuals: true });

export const Hand = mongoose.model("Hand", handSchema);
