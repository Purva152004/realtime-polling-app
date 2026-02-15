require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

// Socket.IO
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

// Attach io globally (safe)
app.set("io", io);

// DB
connectDB();

// Socket logic
require("./socket/socket")(io);

// Routes
app.use("/api/polls", require("./routes/pollRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
