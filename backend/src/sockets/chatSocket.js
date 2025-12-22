const ChatMessage = require("../models/mysql/ChatMessage"); 
let users = {};

module.exports = function(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", ({ userId }) => {
      const room = `chat_${userId}`;
      socket.join(room);
      console.log("Joined:", room);
    });

    socket.on("sendMessage", async (data) => {
      const room = `chat_${data.userId}`;

      await ChatMessage.create({
        userId: data.userId,
        senderRole: data.role,
        message: data.text,
        time: data.time,
      });

      io.to(room).emit("receiveMessage", data);
    });

    socket.on("typing", ({ userId, role }) => {
       io.to(`chat_${userId}`).emit("userTyping", { role });
    });

    socket.on("stopTyping", ({ userId, role }) => {
       io.to(`chat_${userId}`).emit("userStopTyping", { role });
    });


    // MARK SEEN
    socket.on("markSeen", async ({ userId, role }) => {
      await ChatMessage.update(
        { seen: true },
        {
          where: {
            userId,
            senderRole: role === "dietician" ? "user" : "dietician"
          }
        }
      );

      io.to(`room_${userId}`).emit("messageSeen", { by: role });
    });

    socket.on("disconnect", () => {
      delete users[socket.id];
      console.log("User disconnected:", socket.id);
    });
  });
};
