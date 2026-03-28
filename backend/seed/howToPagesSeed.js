import mongoose from "mongoose";
import dotenv from "dotenv";
import HowToPage from "../models/HowToPage.js";

dotenv.config();

const pages = [
  {
    pageNumber: 1,
    leftKicker: "Field Note",
    leftTitle: "Inside the Walls",
    leftImage: "/images/howto-book-1.png",
    leftText: "Before each mission, review the basics. A prepared scout survives longer and fights smarter.",
    leftTip: "Discipline and timing are more valuable than rushing forward blindly.",

    kicker: "Page 1",
    title: "Movement & Controls",
    image: "/images/howto-book-2.png",
    bodyType: "list",
    bodyItems: [
      "Move with A / D or Left / Right Arrow.",
      "Jump with W or Up Arrow.",
      "Use movement carefully to avoid direct titan attacks.",
      "Positioning matters more than rushing forward."
    ]
  },
  {
    pageNumber: 2,
    leftKicker: "Field Note",
    leftTitle: "Scout Positioning",
    leftImage: "/images/howto-book-3.png",
    leftText: "A scout who controls distance and angle has a much greater chance of surviving an encounter.",
    leftTip: "Do not attack from bad positions. Reposition first.",

    kicker: "Page 2",
    title: "Combat Basics",
    image: "/images/howto-book-4.png",
    bodyType: "list",
    bodyItems: [
      "Defeat titans to gain score and progress faster.",
      "Choose better angles before attacking.",
      "Avoid unnecessary collisions and damage.",
      "Stay mobile and do not commit too early."
    ]
  },
  {
    pageNumber: 3,
    leftKicker: "Field Note",
    leftTitle: "Supplies Matter",
    leftImage: "/images/howto-book-5.png",
    leftText: "Supplies, boosts, and resources are essential. Efficient use of items separates skilled players from careless ones.",
    leftTip: "Collect useful items whenever it is safe.",

    kicker: "Page 3",
    title: "Items & Progress",
    image: "/images/howto-book-6.png",
    bodyType: "list",
    bodyItems: [
      "Collect supplies and useful power-up items.",
      "Some items improve damage, speed, or survivability.",
      "More score means faster level progression.",
      "Rewards unlock as you continue your journey."
    ]
  },
  {
    pageNumber: 4,
    leftKicker: "Final Note",
    leftTitle: "A True Scout",
    leftImage: "/images/howto-book-7.png",
    leftText: "Victory comes from control, awareness, and smart decisions under pressure.",
    leftTip: "Survival is only the beginning. Efficiency wins battles.",

    kicker: "Page 4",
    title: "Final Advice",
    image: "/images/howto-book-8.png",
    bodyType: "text",
    bodyText: "Do not think only about surviving. A good scout moves efficiently, uses resources wisely, and knows when to strike.",
    tipTitle: "Scout Tip",
    tipText: "Collect items when it is safe, avoid random attacks, and focus on efficient progression through the level."
  }
];

async function seedHowToPages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await HowToPage.deleteMany({});
    await HowToPage.insertMany(pages);

    console.log("HowTo pages seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedHowToPages();