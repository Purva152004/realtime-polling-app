const express = require("express");
const Poll = require("../models/Poll");
const Vote = require("../models/Vote");

const router = express.Router();

/* Create Poll */
router.post("/create", async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || options.length < 2) {
      return res.status(400).json({ message: "Invalid poll data" });
    }

    const poll = await Poll.create({ question, options });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Get Poll */
router.get("/:id", async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  if (!poll) return res.status(404).json({ message: "Poll not found" });
  res.json(poll);
});

/* Vote */
router.post("/:id/vote", async (req, res) => {
  try {
    const { optionIndex, voterId } = req.body;
    const ip = req.ip;

    const alreadyVoted = await Vote.findOne({
      pollId: req.params.id,
      $or: [{ voterId }, { ip }]
    });

    if (alreadyVoted) {
      return res.status(403).json({ message: "Already voted" });
    }

    const poll = await Poll.findById(req.params.id);
    poll.options[optionIndex].votes += 1;
    await poll.save();

    await Vote.create({ pollId: poll._id, voterId, ip });

    req.io.to(req.params.id).emit("updateResults", poll);
    res.json(poll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
