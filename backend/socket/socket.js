module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("joinPoll", (pollId) => {
      socket.join(pollId);
      console.log(`📊 Joined poll room: ${pollId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};
