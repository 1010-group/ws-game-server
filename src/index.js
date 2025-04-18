const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// Express app yaratish
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Port
const PORT = 3000;

// Socket.IO sozlash
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5174", "http://localhost:5173"], // Frontend React URL
    methods: ["GET", "POST"]
  }
});

// Playerlar ma'lumotlari
let players = {};

// Socket.IO hodisalar
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // O‘yinga qo‘shilish
  socket.on("joinGame", (player) => {
    players[socket.id] = player;
    console.log("🎮 Player joined:", player);
    io.emit("playerJoined", player);
  });

  // Harakat qilish
  socket.on("move", ({ id, position }) => {
    if (players[id]) {
      players[id].position = position;
      io.emit("playerMoved", { id, position });
    }
  });

  // Chiqish
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit("playerLeft", socket.id);
  });
});

// API test endpoint
app.get("/", (req, res) => {
  res.send("✅ Server is running and socket.io is ready.");
});

// Serverni ishga tushurish
server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
