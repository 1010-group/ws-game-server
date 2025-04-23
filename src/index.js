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
    origin: ["http://localhost:5173"], // Frontend URL
    methods: ["GET", "POST"],
  },
});

let players = {};

io.on("connection", (socket) => {
  console.log(`✅ Connected: ${socket.id}`);

  socket.on("joinGame", (player) => {
    players[socket.id] = player;
    console.log("🎮 Player joined:", player);
    io.emit("playerJoined", player);
  });

  socket.on("move", ({ id, position }) => {
    if (players[id]) {
      players[id].position = position;
      io.emit("playerMoved", { id, position });
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
