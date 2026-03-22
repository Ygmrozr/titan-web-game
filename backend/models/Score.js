import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  username: {
    type: String,
    required: true
  },

  score: {
    type: Number,
    required: true
  },

  titanKills: {
    type: Number,
    default: 0
  },

  itemsCollected: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("Score", scoreSchema);