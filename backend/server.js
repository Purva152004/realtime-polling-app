require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: { origin: process.env.CLIENT_URL }
});

connectDB();
require("./socket/socket")(io);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/polls", require("./routes/pollRoutes"));

server.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
