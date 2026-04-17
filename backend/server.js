import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

});

import path from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcrypt"
import session from "express-session"
import validator from "validator"
import User from "./models/User.js"
import Score from "./models/Score.js"
import multer from "multer";
import HowToPage from "./models/HowToPage.js";
import gameLevels from "./data/gameLevels.js";


const app = express()



console.log(process.env.EMAIL_USER)
console.log(process.env.EMAIL_PASS)


// body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

///static files (resimler, css vb)
app.use(express.static("public"))

///session 
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret_session_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 // 1 saat
  }
}))


// Locals
app.use((req,res,next)=>{
  res.locals.error = null
  res.locals.success = null
  res.locals.currentUser = req.session.user || null
  next()
})

// EJS ayarı
app.set("view engine", "ejs")

// dirname ayarı (ES modules için gerekli)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set("views", path.join(__dirname, "views"))


// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB bağlı!")
})
.catch((err) => {
    console.log("MongoDB bağlantı hatası:", err)
})


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const stageData = [
  {
    id: 1,
    name: "Trost",
    requiredLevel: 1,
    story: "Eren'in yolculuğu burada başlıyor. İlk hedefin duvarların içindeki tehlikeyi öğrenmek ve hayatta kalmak."
  },
  {
    id: 2,
    name: "Karanese",
    requiredLevel: 2,
    story: "Titan tehdidi büyüyor. Daha fazla titanla karşılaşacak ve hareket kabiliyetini daha iyi kullanman gerekecek."
  },
  {
    id: 3,
    name: "Stohess",
    requiredLevel: 3,
    story: "Şehir içi çatışmalar yoğunlaşıyor. ODM kullanımın ve doğru zamanlama burada çok önemli."
  },
  {
    id: 4,
    name: "Castle Utgard",
    requiredLevel: 4,
    story: "Düşmanlar daha güçlü. Daha dikkatli ilerlemeli ve kaynaklarını iyi kullanmalısın."
  },
  {
    id: 5,
    name: "Shiganshina",
    requiredLevel: 10,
    story: "Son mücadeleye geldin. Bu bölümde en iyi performansını göstermen gerekiyor."
  }
];


const titleList = [
  { name: "Recruit", minKills: 0 },
  { name: "Cadet", minKills: 5 },
  { name: "Titan Slayer ", minKills: 15 },
  { name: "Scout Veteran", minKills: 30 },
  { name: "Abnormal Hunter", minKills: 60 },
  { name: "Elite Titan Slayer", minKills: 100 },
  { name: "Eternal Scout", minKills: 150 },
  { name: "Blade Master", minKills: 200 },
  { name: "Humanity's Wrath", minKills: 250 },
  { name: "Titan Reaper", minKills: 300 },
  { name: "Humanity's Strongest", minKills: 500 }
];


function getLevelFromScore(score){
  if(score >= 12000) return 10;
  if(score >= 9000) return 9;
  if(score >= 7500) return 8;
  if(score >= 6200) return 7;
  if(score >= 5000) return 6;
  if(score >= 4000) return 5;
  if(score >= 3000) return 4;
  if(score >= 2000) return 3;
  if(score >= 1000) return 2;
  return 1;
}

function getLevelMinScore(level){
  const levelTable = {
    1: 0,
    2: 1000,
    3: 2000,
    4: 3000,
    5: 4000,
    6: 5000,
    7: 6200,
    8: 7500,
    9: 9000,
    10: 12000
  };

  return levelTable[level] || 12000;
}

function getNextLevelScore(level){
  const levelTable = {
    1: 1000,
    2: 2000,
    3: 3000,
    4: 4000,
    5: 5000,
    6: 6200,
    7: 7500,
    8: 9000,
    9: 12000,
    10: 14000
  };

  return levelTable[level] || 14000;
}

function getTitleByKills(titanKills) {
  if (titanKills >= 500) return "Humanity's Strongest";
  if (titanKills >= 300) return "Titan Reaper";
  if (titanKills >= 250) return "Humanity's Wrath";
  if (titanKills >= 200) return "Blade Master";
  if (titanKills >= 150) return "Eternal Scout";
  if (titanKills >= 100) return "Elite Titan Slayer";
  if (titanKills >= 60) return "Abnormal Hunter";
  if (titanKills >= 30) return "Scout Veteran";
  if (titanKills >= 15) return "Titan Slayer";
  if (titanKills >= 5) return "Cadet";
  return "Recruit";
}

function getUnlockedTitlesByKills(titanKills) {
  return titleList
    .filter(title => titanKills >= title.minKills)
    .map(title => title.name);
}

function getLevelRewards(level){
  const rewards = [];

  // her level coin
  rewards.push(`${level * 50} coins`);

  if(level === 3){
    rewards.push("New Title: Titan's Nightmare");
  }

  if(level === 5){
    rewards.push("Character Unlocked: Armin");
  }

  if(level === 10){
    rewards.push("Character Unlocked: Mikasa");
  }

  return rewards;
}



// ---------------- ROUTES ----------------

/////////////// ana sayfa
app.get("/", (req,res)=>{
    res.redirect("/login")
})

////////////// login sayfası
app.get("/login",(req,res)=>{
  res.render("login",{error:null, success:null})
})

/////////////// register sayfası
app.get("/register",(req,res)=>{
  res.render("register",{error:null,success:null})
  
})

////////// hesabım
app.get("/account", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);

    const level = getLevelFromScore(user.totalScore);

    return res.render("account", {
      user: user.toObject ? user.toObject() : user,
      level
    });

  }catch(err){
    console.log("ACCOUNT ERROR:", err);
    return res.redirect("/menu");
  }
});

////////// how to play
app.get("/how-to-play", async (req, res) => {
  try {
    const pages = await HowToPage.find().sort({ pageNumber: 1 }).lean();

    res.render("how-to-play", { pages });
  } catch (error) {
    console.error("How to Play pages fetch error:", error);
    res.status(500).send("How to Play sayfası yüklenemedi.");
  }
});

////////// market
app.get("/market", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);

    const marketItems = [
      { key: "default", name: "Default Skin", price: 0 },
      { key: "survey-corps", name: "Survey Corps Skin", price: 200 },
      { key: "black-cape", name: "Black Cape Skin", price: 300 },
      { key: "elite-mode", name: "Elite Mode Skin", price: 500 }
    ];

    return res.render("market", { user, marketItems });
  }catch(err){
    console.log("MARKET ERROR:", err);
    return res.redirect("/menu");
  }
});

//////////profile
app.get("/profile", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id)

    if(!user){
      return res.redirect("/menu")
    }

    const scores = await Score.find({ userId: user._id })
      .sort({ score: -1 })
      .limit(3)

    return res.render("profile", {
      profileUser: user.toObject ? user.toObject() : user,
      scores
    })
  }catch(err){
    console.log("PROFILE ERROR:", err)
    return res.redirect("/menu")
  }
})


app.get("/game/:level/:sector", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const level = Number(req.params.level);
    const sector = Number(req.params.sector);
    const devMode = req.query.dev === "1";

    const user = await User.findById(req.session.user.id);

    if (!user) {
      return res.redirect("/login");
    }

    const levelData = gameLevels[level];
    const sectorData = levelData?.sectors?.[sector];

    if (!levelData || !sectorData) {
      return res.status(404).send("Level or sector not found.");
    }

    const sectorKey = `${level}-${sector}`;
    const isUnlocked =
      user.unlockedLevels.includes(level) ||
      user.completedSectors.includes(sectorKey);

    const canBypass = devMode && user.isAdmin;

    if (!isUnlocked && !canBypass) {
      return res.status(403).send("This sector is locked.");
    }

    res.render("game", {
      user,
      level,
      sector,
      levelData,
      sectorData,
      devMode: canBypass
    });
  } catch (error) {
    console.error("Game route error:", error);
    res.status(500).send("Game could not be loaded.");
  }
});



app.post("/game/:level/:sector/complete", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const level = Number(req.params.level);
    const sector = Number(req.params.sector);

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const levelData = gameLevels[level];
    const sectorData = levelData?.sectors?.[sector];

    if (!levelData || !sectorData) {
      return res.status(404).json({ success: false, message: "Level or sector not found" });
    }

    const sectorKey = `${level}-${sector}`;

    if (!user.completedSectors.includes(sectorKey)) {
      user.completedSectors.push(sectorKey);
      user.totalScore += sectorData.reward || 0;
    }

    let nextLevel = level;
    let nextSector = sector;

    if (sector < 10) {
      nextSector = sector + 1;
      user.currentLevel = level;
      user.currentSector = nextSector;
    } else if (level < 5) {
      nextLevel = level + 1;
      nextSector = 1;

      if (!user.unlockedLevels.includes(nextLevel)) {
        user.unlockedLevels.push(nextLevel);
      }

      user.currentLevel = nextLevel;
      user.currentSector = nextSector;
    } else {
      user.currentLevel = 5;
      user.currentSector = 10;
    }

    await user.save();

    return res.json({
      success: true,
      nextLevel,
      nextSector,
      reward: sectorData.reward || 0,
      totalScore: user.totalScore,
      completedSectors: user.completedSectors,
      unlockedLevels: user.unlockedLevels
    });
  } catch (error) {
    console.error("Complete sector error:", error);
    return res.status(500).json({ success: false, message: "Could not complete sector" });
  }
});


//////////avatar
app.post("/account/avatar", requireAuth, upload.single("avatar"), async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);

    if(req.file){
      user.avatar = "/uploads/" + req.file.filename;
      await user.save();
    }

    return res.redirect("/account");
  }catch(err){
    console.log("AVATAR UPLOAD ERROR:", err);
    return res.redirect("/account");
  }
});

////////// buy item / skin
app.post("/market/buy/:itemKey", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);
    const itemKey = req.params.itemKey;

    const prices = {
      "default": 0,
      "survey-corps": 200,
      "black-cape": 300,
      "elite-mode": 500
    };

    const price = prices[itemKey];

    if(price === undefined){
      return res.redirect("/market");
    }

    if(user.ownedSkins.includes(itemKey)){
      return res.redirect("/market");
    }

    if(user.coins < price){
      return res.redirect("/market");
    }

    user.coins -= price;
    user.ownedSkins.push(itemKey);

    await user.save();

    return res.redirect("/market");
  }catch(err){
    console.log("BUY ERROR:", err);
    return res.redirect("/market");
  }
});

////////// select skin
app.post("/market/select/:itemKey", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);
    const itemKey = req.params.itemKey;

    if(!user.ownedSkins.includes(itemKey)){
      return res.redirect("/market");
    }

    user.selectedSkin = itemKey;
    await user.save();

    return res.redirect("/market");
  }catch(err){
    console.log("SELECT SKIN ERROR:", err);
    return res.redirect("/market");
  }
});

///////// verify
app.get("/verify/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.send("Invalid verification link");
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.send("User not found");
    }

    user.verified = true;
    await user.save();

    return res.redirect("/login");
  } catch (err) {
    console.log("VERIFY ERROR:", err);
    return res.send("Verification failed");
  }
});

////////// save score
app.post("/save-score", requireAuth, async (req,res)=>{
  try{
    const { score, titanKills, itemsCollected } = req.body;

    const user = await User.findById(req.session.user.id);

    if(!user){
      return res.status(404).json({ success:false, message:"User not found" });
    }

    if(!Array.isArray(user.unlockedCharacters)){
      user.unlockedCharacters = ["eren"];
    }

    if(!Array.isArray(user.unlockedTitles)){
      user.unlockedTitles = ["Recruit"];
    }

    const oldLevel = user.level || 1;
    const oldTitle = getTitleByKills(user.titanKills || 0);

    await Score.create({
      userId: user._id,
      username: user.username,
      score: Number(score) || 0,
      titanKills: Number(titanKills) || 0,
      itemsCollected: Number(itemsCollected) || 0
    });

    user.totalScore += Number(score) || 0;
    user.titanKills += Number(titanKills) || 0;
    user.itemsCollected += Number(itemsCollected) || 0;
    user.coins += Math.floor((Number(score) || 0) / 10);

    if((Number(score) || 0) > user.highestScore){
      user.highestScore = Number(score) || 0;
    }

    const newLevel = getLevelFromScore(user.totalScore);
    user.level = newLevel;

    let unlockedCharacter = null;

    if(newLevel > oldLevel){
      req.session.levelUp = `Level Up! Level ${newLevel}`;
      req.session.levelRewards = getLevelRewards(newLevel);
    }

    if(user.level >= 5 && !user.unlockedCharacters.includes("armin")){
      user.unlockedCharacters.push("armin");
      unlockedCharacter = "armin";
    }

    if(user.level >= 10 && !user.unlockedCharacters.includes("mikasa")){
      user.unlockedCharacters.push("mikasa");
      unlockedCharacter = "mikasa";
    }

    user.unlockedTitles = getUnlockedTitlesByKills(user.titanKills);
    const newTitle = getTitleByKills(user.titanKills);

    let unlockedTitle = null;
    if(oldTitle !== newTitle){
      unlockedTitle = newTitle;
      req.session.titleUnlocked = `New title unlocked: ${newTitle}`;
    }

    await user.save();

    return res.json({
      success: true,
      unlockedTitle,
      unlockedCharacter,
      totalScore: user.totalScore,
      highestScore: user.highestScore,
      level: user.level
    });

  }catch(err){
    console.log("SAVE SCORE ERROR:", err);
    return res.status(500).json({ success:false, message:"Could not save score" });
  }
});


////////////////// register işlemi
app.post("/register", async (req,res)=>{
try{
const {username,email,password,confirmPassword} = req.body
// boş alan kontrol
if(!username || !email || !password || !confirmPassword){
return res.render("register",{error:"Fill in all the fields.",success:null})
}
// email format kontrol
if(!validator.isEmail(email)){
return res.render("register",{error:"Invalid email address",success:null})
}
// password eşleşme
if(password !== confirmPassword){
return res.render("register",{error:"Passwords don't match.",success:null})
}
//password  format
const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_ %*?&]).{8,}$/;

if(!passwordRegex.test(password)){
return res.render("register",{
error:"The password must be at least 8 characters long and must include uppercase letters, lowercase letters, numbers, and special characters.",success:null})
}
//duplicate user kontrol
const existingUser = await User.findOne({
$or:[{username},{email}]
})
if(existingUser){
return res.render("register",{error:"Username or email already in use",success:null})
}
// password hash
const hashedPassword = await bcrypt.hash(password,10)
// kullanıcı oluştur
const user = new User({
username,
email,
password:hashedPassword
})
await user.save()


/////////////////verify mail
const verifyLink = `http://localhost:5000/verify/${user._id}`

await transporter.sendMail({
from:process.env.EMAIL_USER,
to:email,
subject:"Email Verification",

html:`
<h2>Verify email</h2>
<a href="${verifyLink}">Verify your email and log in.</a>
`
})

// register sayfasında mesaj göster
return res.render("register",{
error:null,
success:"📧An email verification link has been sent. Please check your email."
})

}catch(err){
console.log("REGISTER ERROR:", err)

return res.render("register",{
error:"An error occurred during registration.",
success:null
})
}

})


/////////login işlemi
app.post("/login", async (req,res)=>{
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.render("login", { error: "User not found", success: null });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.render("login", { error: "Incorrect password", success: null });
    }

    if (!user.verified) {
      return res.render("login", { error: "Email address not verified.", success: null });
    }
    user.lastLoginAt = new Date();
    await user.save();

    req.session.user = {
     id: user._id,
     username: user.username,
     email: user.email
};

return res.redirect("/menu");
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return res.render("login", { error: "Something went wrong." });
  }
});

///////////forgot password
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.render("forgot", {
        error: "Email address required.",
        success: null
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.render("forgot", {
        error: "The email address is not registered.",
        success: null
      });
    }

    const resetLink = `http://localhost:5000/reset-password/${user._id}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password reset",
      html: `
        <h2>Password Reset</h2>
        <p>To reset your password, click the link below.</p>
        <a href="${resetLink}">Reset Password</a>
      `
    });

    return res.render("forgot", {
      error: null,
      success: "The password reset link has been sent to your email address."
    });
  } catch (err) {
    console.log("FORGOT PASSWORD ERROR:", err);
    return res.render("forgot", {
      error: "Something went wrong while sending reset email.",
      success: null
    });
  }
});

///////////reset password
app.post("/reset-password/:id", async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.render("reset", {
        userId: null,
        error: "Invalid reset link.",
        success: null
      });
    }

    if (password !== confirmPassword) {
      return res.render("reset", {
        userId: req.params.id,
        error: "Passwords don't match.",
        success: null
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#_$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.render("reset", {
        userId: req.params.id,
        error: "The password must be at least 8 characters long and must include uppercase letters, lowercase letters, numbers, and special characters.",
        success: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(req.params.id, {
      password: hashedPassword
    });

    return res.render("reset", {
      userId: null,
      error: null,
      success: "Your password has been successfully changed."
    });
  } catch (err) {
    console.log("RESET PASSWORD ERROR:", err);
    return res.render("reset", {
      userId: req.params.id,
      error: "Something went wrong while resetting password.",
      success: null
    });
  }
});

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login")
  }
  next()
}

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("LOGOUT ERROR:", err)
      return res.redirect("/game")
    }
    res.redirect("/login")
  })
})

/////forgot password
app.get("/forgot-password",(req,res)=>{
res.render("forgot",{error:null,success:null})
})

////////menu
app.get("/menu", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);

    const level = getLevelFromScore(user.totalScore);
    const currentMin = getLevelMinScore(level);
    const nextLevel = getNextLevelScore(level);
    const progress = (user.totalScore - currentMin) / (nextLevel - currentMin);

    const titleUnlocked = req.session.titleUnlocked || null;
    const levelUp = req.session.levelUp || null;
    const levelRewards = req.session.levelRewards || null;

    const nextLevelRewards = getLevelRewards(level + 1);

    req.session.titleUnlocked = null;
    req.session.levelUp = null;
    req.session.levelRewards = null;

    return res.render("menu", {
      user: user.toObject(),
      level,
      progress,
      nextLevel,
      titleUnlocked,
      levelUp,
      levelRewards,
      nextLevelRewards
    });

  }catch(err){
    console.log("MENU ERROR:", err);
    return res.redirect("/login");
  }
});

////////map
app.get("/map", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);

    const level = getLevelFromScore(user.totalScore);
    const currentMin = getLevelMinScore(level);
    const nextLevel = getNextLevelScore(level);

    const progress =
      (user.totalScore - currentMin) / (nextLevel - currentMin);

    const titleUnlocked = req.session.titleUnlocked || null;
    req.session.titleUnlocked = null;
    
    let unlockedStage = 1;

    if(level >= 2) unlockedStage = 2;
    if(level >= 3) unlockedStage = 3;
    if(level >= 4) unlockedStage = 4;
    if(level >= 10) unlockedStage = 5;

    return res.render("map", {
      user: user.toObject ? user.toObject() : user,
      level,
      progress,
      nextLevel,
      titleUnlocked,
      unlockedStage,
      stageData
    });

  }catch(err){
    console.log("MAP ERROR:", err);
    return res.redirect("/menu");
  }
});

///// titles
app.get("/titles", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);

    return res.render("titles", {
      user: user.toObject(),
      titleList
    });
  }catch(err){
    console.log("TITLES PAGE ERROR:", err);
    return res.redirect("/menu");
  }
});

////////// leaderboard
app.get("/leaderboard", requireAuth, async (req,res)=>{
  try{
    const topScores = await Score.aggregate([
      { $sort: { score: -1, createdAt: 1 } },
      {
        $group: {
          _id: "$userId",
          username: { $first: "$username" },
          score: { $first: "$score" },
          titanKills: { $first: "$titanKills" },
          itemsCollected: { $first: "$itemsCollected" }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 10 }
    ]);

    const topScoresWithTitles = topScores.map(entry => {
      let title = "Recruit";

      if (entry.titanKills >= 100) title = "Humanity’s Strongest";
      else if (entry.titanKills >= 60) title = "Elite Titan Slayer";
      else if (entry.titanKills >= 30) title = "Scout Veteran";
      else if (entry.titanKills >= 15) title = "Titan Hunter";
      else if (entry.titanKills >= 5) title = "Cadet";

      return {
        ...entry,
        title
      };
    });

    return res.render("leaderboard", { topScores: topScoresWithTitles });
  }catch(err){
    console.log("LEADERBOARD ERROR:", err);
    return res.redirect("/menu");
  }
});

////////// public user profile
app.get("/user/:id", requireAuth, async (req,res)=>{
  try{
    if(!mongoose.isValidObjectId(req.params.id)){
      return res.redirect("/leaderboard")
    }

    const user = await User.findById(req.params.id)

    if(!user){
      return res.redirect("/leaderboard")
    }

    const scores = await Score.find({ userId: user._id })
      .sort({ score: -1 })
      .limit(3)

    return res.render("profile", {
      profileUser: user.toObject ? user.toObject() : user,
      scores
    })
  }catch(err){
    console.log("PUBLIC PROFILE ERROR:", err)
    return res.redirect("/leaderboard")
  }
})

///////reset password
app.get("/reset-password/:id",(req,res)=>{
res.render("reset",{
userId:req.params.id,
error:null,
success:null
})
})

//////////game
app.get("/game", requireAuth, (req,res)=>{
  const username = req.session.user.username
  res.render("game",{username})
})


// server başlat
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server ${PORT} portunda başladı`)
})