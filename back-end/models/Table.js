import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Table name is required'],
    trim: true
  },
  max_players: {
    type: Number,
    default: 4,
    min: [1, 'Table must allow at least 1 player'],
    max: [7, 'Table cannot have more than 7 players']
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'FULL', 'MAINTENANCE'],
    default: "ACTIVE"
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

tableSchema.index({ status: 1 });

export const Table = mongoose.model("Table", tableSchema);
