import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  verified: {
    type: Boolean,
    default: false
  },

  avatar: {
    type: String,
    default: "/images/default-avatar.png"
  },

  totalScore: {
    type: Number,
    default: 0
  },

  highestScore: {
    type: Number,
    default: 0
  },

  titanKills: {
    type: Number,
    default: 0
  },

  itemsCollected: {
    type: Number,
    default: 0
  },

  coins: {
    type: Number,
    default: 0
  },

  ownedSkins: {
    type: [String],
    default: ["default"]
  },

  selectedSkin: {
    type: String,
    default: "default"
  },

  lastLoginAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);