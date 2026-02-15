const express = require("express");
const router = express.Router();

const Poll = require("../models/Poll");
const Vote = require("../models/Vote");

/**
 * Create poll
 */
router.post("/create", async (req, res) => {
  try {
    const { question, options } = req.body;

    const poll = await Poll.create({
      question,
      options: options.map(o => ({
        text: o.text,
        votes: 0
      }))
    });

    res.status(201).json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create poll" });
  }
});

/**
 * Get poll by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    res.json(poll);
  } catch (err) {
    res.status(500).json({ message: "Error fetching poll" });
  }
});

/**
 * Vote on poll
 */
router.post("/:id/vote", async (req, res) => {
  const { optionIndex, voterId } = req.body;

  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // prevent duplicate voting
    const alreadyVoted = await Vote.findOne({
      pollId: poll._id,
      voterId
    });

    if (alreadyVoted) {
      return res.status(409).json({ message: "Already voted" });
    }

    // save vote
    await Vote.create({
      pollId: poll._id,
      voterId,
      optionIndex
    });

    // increment vote count
    poll.options[optionIndex].votes += 1;
    await poll.save();

    // realtime update
    req.io.to(poll._id.toString()).emit("updateResults", poll);

    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Vote failed" });
  }
});

module.exports = router;
