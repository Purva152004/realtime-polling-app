const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
    question: String,
    options: [
      {
        text: String,
        votes: { type: Number, default: 0 }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Poll", pollSchema);
