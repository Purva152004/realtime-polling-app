const express = require("express");
const router = express.Router();
const Poll = require("../models/Poll");
const Vote = require("../models/Vote");

/**
 * CREATE POLL
 */
router.post("/create", async (req, res) => {
  try {
    const poll = await Poll.create(req.body);
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ message: "Failed to create poll" });
  }
});

/**
 * GET POLL BY ID
 */
router.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    res.json(poll);
  } catch {
    res.status(404).json({ message: "Poll not found" });
  }
});

/**
 * VOTE
 */
router.post("/:id/vote", async (req, res) => {
  try {
    const { optionIndex, voterId } = req.body;

    // 1️⃣ Prevent duplicate vote
    const alreadyVoted = await Vote.findOne({
      pollId: req.params.id,
      voterId
    });

    if (alreadyVoted) {
      return res.status(400).json({ message: "Already voted" });
    }

    // 2️⃣ Save vote
    await Vote.create({
      pollId: req.params.id,
      optionIndex,
      voterId
    });

    // 3️⃣ Update poll option count
    const poll = await Poll.findById(req.params.id);
    poll.options[optionIndex].votes += 1;
    await poll.save();

    // 4️⃣ Emit updated poll to everyone
    req.io.to(req.params.id).emit("updateResults", poll);

    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Vote failed" });
  }
});

module.exports = router;
