const express = require("express");
require("dotenv").config();

console.log("EMAIL USER:", process.env.EMAIL_USER);
const app = express();
const PORT = 3000;
// middleware
app.use(express.json());  //backend can read JSON
const User = require("./models/User");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const mongoose = require("mongoose");
const Expense = require("./models/Expense");
const auth = require("./middleware/auth");
const cors = require("cors");

app.use(cors({
  origin: "*",   // for development only
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });


const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// client.messages
//   .create({
//     body: "Test SMS from OTP app",
//     from: process.env.TWILIO_PHONE_NUMBER,
//     to: "+917795877108" // use your number for testing
//   })
//   .then(message => console.log("SMS sent:", message.sid))
//   .catch(err => console.error("SMS error:", err.message));

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 THIS IS THE IMPORTANT PART
    const user = await User.findOne({
      identifier: decoded.identifier,
      type: decoded.type
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // ✅ NOW req.user._id EXISTS
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

app.get("/api/profile", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Profile accessed successfully",
    user: req.user
  });
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is healthy 💪"
  });
});
// temporary in-memory users (for learning)
const users = [];
const otpStore = [];

// signup API
app.post("/api/auth/signup", (req, res) => {
  const { username, password } = req.body;

  // basic validation
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  // check if user already exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  // create user
  const newUser = { username, password };
  users.push(newUser);

  res.status(201).json({
    message: "User registered successfully 🎉"
  });
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
// REQUEST OTP API
app.post("/api/auth/request-otp", async (req, res) => {
  const { type, email, phone } = req.body;

  // 1. validate type
  if (!type || !["email", "sms"].includes(type)) {
    return res.status(400).json({ message: "Invalid OTP type" });
  }

  // 2. determine identifier
  const identifier =
    type === "email" ? email :
    type === "sms" ? phone :
    null;

  if (!identifier) {
    return res.status(400).json({
      message: type === "email" ? "Email is required" : "Phone is required"
    });
  }

  // 3. generate OTP + expiry
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  // 4. remove any existing OTP for same identifier
  const index = otpStore.findIndex(
    item => item.type === type && item.identifier === identifier
  );
  if (index !== -1) otpStore.splice(index, 1);

  // 5. store OTP
  otpStore.push({ type, identifier, otp, expiresAt });

  // 6. send OTP
  if (type === "email") {
    transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: identifier,
        subject: "Your Login OTP",
        html: `
          <h2>Login OTP</h2>
          <p>Your OTP is <b>${otp}</b></p>
          <p>This OTP is valid for 5 minutes.</p>
        `
      },
      (err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to send email OTP" });
        }
        res.status(200).json({ message: "OTP sent via email 📧" });
      }
    );
  }

  if (type === "sms") {
    client.messages
      .create({
        body: `Your OTP is ${otp}. Valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: identifier
      })
      .then(() => {
        res.status(200).json({ message: "OTP sent via SMS 📱" });
      })
      .catch((error) => {
        console.error("Twilio SMS Error:", error);
        res.status(500).json({ message: "Failed to send SMS OTP" });
      });

      
      
  }
});

// VERIFY OTP API
app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { type, email, phone, otp } = req.body;

    // 1️⃣ Validate type
    if (!type || !["email", "sms"].includes(type)) {
      return res.status(400).json({ message: "Invalid OTP type" });
    }

    // 2️⃣ Resolve identifier
    const identifier =
      type === "email" ? email :
      type === "sms" ? phone :
      null;

    if (!identifier || !otp) {
      return res.status(400).json({
        message: "Identifier and OTP are required",
      });
    }

    // 3️⃣ Find OTP record
    const record = otpStore.find(
      (item) => item.type === type && item.identifier === identifier
    );

    if (!record) {
      return res.status(404).json({
        message: "OTP not found. Request again.",
      });
    }

    // 4️⃣ Check expiry
    if (Date.now() > record.expiresAt) {
      otpStore.splice(otpStore.indexOf(record), 1);
      return res.status(410).json({
        message: "OTP expired. Request again.",
      });
    }

    // 5️⃣ Check OTP value
    if (record.otp !== otp) {
      return res.status(401).json({
        message: "Invalid OTP",
      });
    }

    // 6️⃣ Remove OTP after successful verification
    otpStore.splice(otpStore.indexOf(record), 1);

    // 🔥 7️⃣ CHECK / CREATE USER IN MONGODB
    let user = await User.findOne({ identifier, type });

    if (!user) {
      user = await User.create({
        identifier,
        type,
      });
    }

    // 🔐 8️⃣ Issue JWT
    const token = jwt.sign(
      {
        identifier: user.identifier,
        type: user.type,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // 9️⃣ Send response
    res.status(200).json({
      message: "OTP verified successfully 🎉 Login successful",
      token,
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      message: "Server error during OTP verification",
    });
  }
});

// Add Expense
app.post("/api/expenses", auth, async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    if (!amount || !category) {
      return res.status(400).json({
        message: "Amount and category are required",
      });
    }

    const user = await User.findOne({
      identifier: req.user.identifier,
      type: req.user.type,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const expense = await Expense.create({
      user: user._id,
      amount,
      category,
      description,
      date,
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add expense" });
  }
});
//Fetch User Expenses
app.get("/api/expenses", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      identifier: req.user.identifier,
      type: req.user.type,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const expenses = await Expense.find({ user: user._id })
      .sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

app.get("/api/expenses/summary", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Start & end of current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(1);
    endOfMonth.setHours(0, 0, 0, 0);

    const result = await Expense.aggregate([
      {
        $match: { user: userId }
      },
      {
        $facet: {
          totalExpense: [
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" }
              }
            }
          ],
          monthlyExpense: [
            {
              $match: {
                date: { $gte: startOfMonth, $lt: endOfMonth }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" }
              }
            }
          ]
        }
      }
    ]);

    res.json({
      totalExpense: result[0].totalExpense[0]?.total || 0,
      monthlyExpense: result[0].monthlyExpense[0]?.total || 0,
      budget: 20000
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
});

app.get("/api/expenses/categories", authenticateToken, async (req, res) => {
  try {
    const categoryTotals = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id)
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1
        }
      }
    ]);

    res.json(categoryTotals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch category totals" });
  }
});
// Daily expenses for current month
// GET daily expenses by month
app.get("/api/expenses/daily", auth, async (req, res) => {
  const { month, year } = req.query;

  const user = await User.findOne({
    identifier: req.user.identifier,
    type: req.user.type,
  });

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const data = await Expense.aggregate([
    {
      $match: {
        user: user._id,
        date: { $gte: start, $lt: end }
      }
    },
    {
      $group: {
        _id: { $dayOfMonth: "$date" },
        total: { $sum: "$amount" }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  res.json(data);
});



app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
