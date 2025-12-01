import mongoose from "mongoose";

const handSchema = new mongoose.Schema({
  table_id: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
  start_time: Date,
  end_time: Date
}, { timestamps: true });

export const Hand = mongoose.model("Hand", handSchema);
