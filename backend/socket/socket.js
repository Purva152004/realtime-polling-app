module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinPoll", (pollId) => {
      socket.join(pollId);
    });
  });
};
