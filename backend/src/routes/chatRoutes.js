const express = require("express");
const ChatMessage = require("../models/mysql/ChatMessage");
const { getChatInbox , getChat} = require("../controllers/chatController");

const router = express.Router();

// GET chat history for specific user

router.get("/inbox", getChatInbox);
router.get("/:userId", getChat);


module.exports = router;
