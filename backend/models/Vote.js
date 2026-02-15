const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poll",
    required: true
  },
  voterId: {
    type: String,
    required: true
  },
  optionIndexes: {
    type: [Number],
    required: true
  }
});

/**
 * One vote per poll per user (correct for both single & multi)
 */
voteSchema.index({ pollId: 1, voterId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
