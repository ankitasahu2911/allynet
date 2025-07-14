import express from "express";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { verifyToken } from "../middleware/authMiddleware.js";
// import { sendMessage } from "../controllers/messageController.js";
// import { getMessages } from "../controllers/messageController.js";
// import { getConversations } from "../controllers/messageController.js";
import { startConversation } from "../controllers/messageController.js";
// import { authenticate } from "../middleware/authMiddleware.js";
import { protect } from "../middleware/authMiddleware.js"; 
const router = express.Router();



// POST /api/message/send
router.post("/send", verifyToken, async (req, res) => {
  const { receiverId, text } = req.body;
const senderId = req.user._id || req.user.id;

console.log("🔵 Incoming /send message request");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("User from token:", req.user);
  if (!receiverId || !text) {
    return res.status(400).json({ msg: "Missing receiverId or text" });
  }

  try {
    // Find or create conversation
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({ members: [senderId, receiverId] });
      await conversation.save();
    }

    // Save message
    const message = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text,
    });

    await message.save();

    res.status(201).json({ msg: "Message sent", message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/message/conversations
// GET /api/message/conversations
router.get("/conversations", verifyToken, async (req, res) => {
  const userId = req.user.id || req.user._id;

  try {
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    })
      .populate("members", "name profilePhoto _id") // ✅ critical line
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// GET /api/message/:conversationId
router.get("/:conversationId", verifyToken, async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/:conversationId/mark-read", verifyToken, async (req, res) => {
  await Message.updateMany(
    { conversationId: req.params.conversationId, receiver: req.user._id, read: false },
    { $set: { read: true } }
  );
  res.sendStatus(200);
});

router.post("/conversations/start", protect, startConversation); 




export default router;