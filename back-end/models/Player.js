import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Player name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  balance: {
    type: Number,
    default: 1000,
    min: [0, 'Balance cannot be negative']
  },
  total_hands_played: {
    type: Number,
    default: 0,
    min: 0
  },
  total_hands_won: {
    type: Number,
    default: 0,
    min: 0
  },
  total_hands_lost: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

playerSchema.virtual('winRate').get(function() {
  if (this.total_hands_played === 0) return 0;
  return (this.total_hands_won / this.total_hands_played * 100).toFixed(2);
});

playerSchema.set('toJSON', { virtuals: true });
playerSchema.set('toObject', { virtuals: true });
playerSchema.index({ name: 1 });

export const Player = mongoose.model("Player", playerSchema);
