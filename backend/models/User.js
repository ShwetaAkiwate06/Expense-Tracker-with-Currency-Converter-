const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["email", "sms"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
