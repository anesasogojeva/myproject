const ChatMessage = require("../models/mysql/ChatMessage"); 
const User = require("../models/mysql/User");
const { Op } = require("sequelize");


exports.getChatInbox = async (req, res) => {
  try {
    // Group by userId (all users who messaged the dietician)
    const users = await ChatMessage.findAll({
      attributes: [
        "userId",
        // last message:
        [ChatMessage.sequelize.fn("MAX", ChatMessage.sequelize.col("createdAt")), "lastMessageTime"],
      ],
      group: ["userId"],
      order: [[ChatMessage.sequelize.literal("lastMessageTime"), "DESC"]],
    });

    const result = [];

    for (let u of users) {
      const userId = u.userId;

      // Get last message text
      const lastMessage = await ChatMessage.findOne({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });

      // Get unread count (messages sent by user, not dietician, seen = false)
      const unreadCount = await ChatMessage.count({
        where: {
          userId,
          senderRole: "user",
          seen: false,
        },
      });

      // Get user info
      const user = await User.findByPk(userId);

      result.push({
        userId,
        name: user?.name || "Unknown User",
        email: user?.email,
        lastMessage: lastMessage ? lastMessage.message : "",
        lastMessageTime: lastMessage ? lastMessage.createdAt : null,
        unreadCount,
      });
    }

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to load inbox" });
  }
};

exports.getChat = async (req, res) => {
  try {
    const messages = await ChatMessage.findAll({
      where: { userId: req.params.userId },
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load chat history" });
  }
};

