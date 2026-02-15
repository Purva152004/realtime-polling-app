router.post("/:id/vote", async (req, res) => {
  const { optionIndex, voterId } = req.body;

  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    const alreadyVoted = await Vote.findOne({
      pollId: poll._id,
      voterId,
    });

    if (alreadyVoted) {
      return res.status(409).json({ message: "Already voted" });
    }

    await Vote.create({
      pollId: poll._id,
      voterId,
      optionIndex,
    });

    poll.options[optionIndex].votes += 1;
    await poll.save();

    // 🔐 SAFE socket emit
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
