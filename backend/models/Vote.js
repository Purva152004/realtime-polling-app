const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll" },
  voterId: String,
  ip: String
});

module.exports = mongoose.model("Vote", voteSchema);
