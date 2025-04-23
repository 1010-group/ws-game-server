const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],  // Change this to your frontend's URL
    methods: ["GET", "POST"],
  },
});

// Store players in memory
let players = {};

// Handling connections
io.on("connection", (socket) => {
  console.log(`✅ Connected: ${socket.id}`);

  // When a player joins the game
  socket.on("joinGame", (player) => {
    const playerWithId = {
      ...player,
      id: socket.id,
      position: player.position || { x: 100, y: 100 }, // Default position
    };

    players[socket.id] = playerWithId;  // Save player in players object
    console.log("🎮 Player joined:", playerWithId);
    
    // Notify other players that a new player has joined
    io.emit("playerJoined", playerWithId);
    console.log("📤 Sent playerJoined:", playerWithId); // Debugging output
  });

  // Handle player movement
  socket.on("move", ({ id, position }) => {
    console.log("🚶 Move received:", { id, position });
    
    // Update the position of the player if found
    if (players[id]) {
      players[id].position = position;
      console.log("🚶 Updated player position:", players[id]);
      
      // Notify all players about the updated position
      io.emit("playerMoved", { id, position });
    } else {
      console.warn("⚠️ Player not found:", id); // Player not found in players object
    }
  });

  // When a player disconnects
  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${socket.id}`);
    delete players[socket.id];  // Remove the player from the players object
    
    // Notify other players that this player has left
    io.emit("playerLeft", socket.id);
  });
});

// Test endpoint to verify the server is running
app.get("/", (req, res) => {
  res.send("✅ Server is running.");
});

// Start server on specified port
server.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
