const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/database");
const userRouter = require("./routes/userRouter");

const app = express();
const server = http.createServer(app);
const PORT = 3000;

// Подключение к MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API маршруты
app.use("/api/v1/", userRouter);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: ["*"],
    methods: ["GET", "POST"],
  },
});

// Store players in memory
let players = {};

// Handling connections
io.on("connection", (socket) => {
  console.log(`✅ Connected: ${socket.id}`);

  socket.on("joinGame", (player) => {
    const playerWithId = {
      ...player,
      id: socket.id,
      position: player.position || { x: 100, y: 100 },
    };

    players[socket.id] = playerWithId;
    console.log("🎮 Player joined:", playerWithId);

    io.emit("playerJoined", playerWithId);
    console.log("📤 Sent playerJoined:", playerWithId);
  });

  socket.on("move", ({ id, position }) => {
    console.log("🚶 Move received:", { id, position });

    if (players[id]) {
      players[id].position = position;
      console.log("🚶 Updated player position:", players[id]);
      io.emit("playerMoved", { id, position });
    } else {
      console.warn("⚠️ Player not found:", id);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit("playerLeft", socket.id);
  });
});

// Test endpoint
app.get("/", (req, res) => {
  res.send("✅ Server is running.");
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
