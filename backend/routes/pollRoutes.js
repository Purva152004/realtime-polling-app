router.post("/:id/vote", async (req, res) => {
  const { optionIndex, voterId } = req.body;

  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // Check if already voted
    const existingVote = await Vote.findOne({
      pollId: poll._id,
      voterId
    });

    if (existingVote) {
      return res.status(409).json({ message: "Already voted" });
    }

    // Save vote
    await Vote.create({
      pollId: poll._id,
      voterId,
      optionIndex
    });

    // Increment count
    poll.options[optionIndex].votes += 1;
    await poll.save();

    // Emit updated poll
    req.io.to(poll._id.toString()).emit("updateResults", poll);

    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Vote failed" });
  }
});
