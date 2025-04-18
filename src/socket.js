const { Server } = require("socket.io");
const io = new Server(3000, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // O'yinchi qo'shildi
  socket.on("joinGame", (playerData) => {
    console.log("Player joined:", playerData);
    socket.broadcast.emit("playerJoined", playerData);
  });

  // Harakat yuborildi
  socket.on("move", (movementData) => {
    socket.broadcast.emit("playerMoved", movementData);
  });

  // Ajralish
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    socket.broadcast.emit("playerLeft", socket.id);
  });
});
