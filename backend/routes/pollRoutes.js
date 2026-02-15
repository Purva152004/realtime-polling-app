// const express = require("express");
// const router = express.Router();

// const Poll = require("../models/Poll");
// const Vote = require("../models/Vote");

// /**
//  * CREATE POLL
//  */
// router.post("/create", async (req, res) => {
//   try {
//     const { question, options } = req.body;

//     const poll = await Poll.create({
//       question,
//       options: options.map(o => ({
//         text: o.text,
//         votes: 0
//       }))
//     });

//     res.status(201).json(poll);
//   } catch (err) {
//     console.error("Create poll error:", err);
//     res.status(500).json({ message: "Failed to create poll" });
//   }
// });

// /**
//  * GET POLL
//  */
// router.get("/:id", async (req, res) => {
//   try {
//     const poll = await Poll.findById(req.params.id);
//     if (!poll) return res.status(404).json({ message: "Poll not found" });

//     res.json(poll);
//   } catch (err) {
//     console.error("Get poll error:", err);
//     res.status(500).json({ message: "Error fetching poll" });
//   }
// });

// /**
//  * VOTE
//  */
// router.post("/:id/vote", async (req, res) => {
//   const { optionIndex, voterId } = req.body;

//   try {
//     const poll = await Poll.findById(req.params.id);
//     if (!poll) return res.status(404).json({ message: "Poll not found" });

//     const alreadyVoted = await Vote.findOne({
//       pollId: poll._id,
//       voterId
//     });

//     if (alreadyVoted) {
//       return res.status(409).json({ message: "Already voted" });
//     }

//     await Vote.create({
//       pollId: poll._id,
//       voterId,
//       optionIndex
//     });

//     poll.options[optionIndex].votes += 1;
//     await poll.save();

//     // SAFE socket emit
//     const io = req.app.get("io");
//     if (io) {
//       io.to(poll._id.toString()).emit("updateResults", poll);
//     }

//     res.json(poll);
//   } catch (err) {
//     console.error("Vote error:", err);
//     res.status(500).json({ message: "Vote failed" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();

const Poll = require("../models/Poll");
const Vote = require("../models/Vote");

/**
 * CREATE POLL
 */
router.post("/create", async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "Invalid poll data" });
    }

    const cleanedOptions = options
      .map(o => o.text?.trim())
      .filter(Boolean)
      .map(text => ({ text, votes: 0 }));

    if (cleanedOptions.length < 2) {
      return res.status(400).json({ message: "At least 2 options required" });
    }

    const poll = await Poll.create({
      question: question.trim(),
      options: cleanedOptions
    });

    res.status(201).json(poll);
  } catch (err) {
    console.error("Create poll error:", err);
    res.status(500).json({ message: "Failed to create poll" });
  }
});

/**
 * GET POLL
 */
router.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    res.json(poll);
  } catch (err) {
    console.error("Get poll error:", err);
    res.status(500).json({ message: "Error fetching poll" });
  }
});

/**
 * VOTE
 */
router.post("/:id/vote", async (req, res) => {
  const { optionIndex, voterId } = req.body;

  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    if (
      typeof optionIndex !== "number" ||
      optionIndex < 0 ||
      optionIndex >= poll.options.length
    ) {
      return res.status(400).json({ message: "Invalid option index" });
    }

    const alreadyVoted = await Vote.findOne({
      pollId: poll._id,
      voterId
    });

    if (alreadyVoted) {
      return res.status(409).json({ message: "Already voted" });
    }

    await Vote.create({
      pollId: poll._id,
      voterId,
      optionIndex
    });

    poll.options[optionIndex].votes += 1;
    await poll.save();

    const io = req.app.get("io");
    if (io) {
      io.to(poll._id.toString()).emit("updateResults", poll);
    }

    res.json(poll);
  } catch (err) {
    console.error("Vote error:", err);
    res.status(500).json({ message: "Vote failed" });
  }
});

module.exports = router;
