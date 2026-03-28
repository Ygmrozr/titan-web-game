import mongoose from "mongoose";

const howToPageSchema = new mongoose.Schema(
  {
    pageNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    leftKicker: {
      type: String,
      required: true,
      trim: true,
    },
    leftTitle: {
      type: String,
      required: true,
      trim: true,
    },
    leftImage: {
      type: String,
      required: true,
      trim: true,
    },
    leftText: {
      type: String,
      required: true,
      trim: true,
    },
    leftTip: {
      type: String,
      required: true,
      trim: true,
    },

    kicker: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },

    bodyType: {
      type: String,
      enum: ["list", "text"],
      default: "list",
    },

    bodyItems: {
      type: [String],
      default: [],
    },

    bodyText: {
      type: String,
      default: "",
    },

    tipTitle: {
      type: String,
      default: "",
      trim: true,
    },

    tipText: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const HowToPage = mongoose.model("HowToPage", howToPageSchema);

export default HowToPage;