
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

/* Allowed origins */
const allowedOrigins = [
  "http://localhost:5173",
  "https://realtime-polling-app-zeta.vercel.app"
];

/* CORS middleware */
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

/* Socket.IO */
const io = require("socket.io")(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

/* attach io */
app.set("io", io);

/* DB */
connectDB();

/* sockets */
require("./socket/socket")(io);

/* routes */
app.use("/api/polls", require("./routes/pollRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
