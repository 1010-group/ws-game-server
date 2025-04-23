const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

let players = {};

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
  });

  socket.on("move", ({ id, position }) => {
    console.log("🚶 Move received:", { id, position }); // Отладка
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

app.get("/", (req, res) => {
  res.send("✅ Server is running.");
});

server.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
});