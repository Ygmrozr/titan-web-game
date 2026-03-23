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

  unlockedTitles: {
  type: [String],
  default: ["Recruit"]
  },

  lastLoginAt: {
    type: Date,
    default: null
  }

  
}, { timestamps: true });

export default mongoose.model("User", userSchema);

userSchema.virtual("title").get(function () {
  if (this.titanKills >= 500) return "Cadet";
  if (this.titanKills >= 300) return "Cadet";
  if (this.titanKills >= 250) return "Cadet";
  if (this.titanKills >= 200) return "Cadet";
  if (this.titanKills >= 150) return "Cadet";
  if (this.titanKills >= 100) return "Humanity’s Strongest";
  if (this.titanKills >= 60) return "Elite Titan Slayer";
  if (this.titanKills >= 30) return "Scout Veteran";
  if (this.titanKills >= 15) return "Titan Hunter";
  if (this.titanKills >= 5) return "Cadet";
  return "Recruit";
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });
