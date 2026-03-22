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


// sonra Locals
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

////////// profile
app.get("/profile", requireAuth, async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);
    return res.render("profile", { user });
  }catch(err){
    console.log("PROFILE ERROR:", err);
    return res.redirect("/menu");
  }
});

////////// how to play
app.get("/how-to-play", requireAuth, (req,res)=>{
  res.render("how-to-play");
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


//////////avatar
app.post("/profile/avatar", requireAuth, upload.single("avatar"), async (req,res)=>{
  try{
    const user = await User.findById(req.session.user.id);

    if(req.file){
      user.avatar = "/uploads/" + req.file.filename;
      await user.save();
    }

    return res.redirect("/profile");
  }catch(err){
    console.log("AVATAR UPLOAD ERROR:", err);
    return res.redirect("/profile");
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
    const { score, titanKills, itemsCollected } = req.body

    const user = await User.findById(req.session.user.id)

    if(!user){
      return res.status(404).json({ success:false, message:"User not found" })
    }

    await Score.create({
      userId: user._id,
      username: user.username,
      score,
      titanKills,
      itemsCollected
    })

    user.totalScore += Number(score) || 0
    user.titanKills += Number(titanKills) || 0
    user.itemsCollected += Number(itemsCollected) || 0
    user.coins += Math.floor((Number(score) || 0) / 10)

    if((Number(score) || 0) > user.highestScore){
      user.highestScore = Number(score) || 0
    }

    await user.save()

    return res.json({ success:true })
  }catch(err){
    console.log("SAVE SCORE ERROR:", err)
    return res.status(500).json({ success:false, message:"Could not save score" })
  }
})

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
app.get("/menu", requireAuth, (req,res)=>{
  console.log("MENU ROUTE CALISTI")
  res.render("menu")
})


////////// leaderboard
app.get("/leaderboard", requireAuth, async (req,res)=>{
  try{
    const topScores = await Score.find().sort({ score: -1 }).limit(10);
    return res.render("leaderboard", { topScores });
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
      .limit(10)

    return res.render("public-profile", {
      profileUser: user,
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