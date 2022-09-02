const path = require("path");
const http = require("http");
const express = require("express");
//const socketio = require("socket.io");
const cors = require("cors"); 

const createMessage = require("./utils/messages");
const config = require("./knexfile");
const knex = require("knex")(config[process.env.NODE_ENV]);
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");

const roomTable = require("./utils/room");

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const socketio = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE"]
    }
});

app.use(cors()); 

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", async ( { username, room }) => {
    await roomTable.createRoom(room);
    const user = userJoin(socket.id, username, room);

    socket.room = room;

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", createMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        createMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", createMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect",async () => {
    const user = await userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        createMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });

  socket.on("delete", async (room) => { 
      await roomTable.deleteRoom(room);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));