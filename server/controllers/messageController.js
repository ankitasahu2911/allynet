import Conversation from "../models/Conversation.js";

// POST /api/messages
export const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body;
  const senderId = req.user._id || req.user.id;

  if (!receiverId || !text) {
    return res.status(400).json({ msg: "Missing receiverId or text" });
  }

  try {
    // Find or create the conversation
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({ members: [senderId, receiverId] });
      await conversation.save();
    }

    conversation.updatedAt = Date.now();
    await conversation.save();

    // Create message
    const message = await Message.create({
      sender: senderId,
      text,
      conversationId: conversation._id,
    });

    res.status(201).json({ msg: "Message sent", message });
  } catch (err) {
    res.status(500).json({ msg: "Failed to send message", error: err.message });
  }
};


// GET /api/message/:conversationId
export const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "name profilePhoto _id");

    res.status(200).json(messages);
  } catch (err) {
    console.error("Message fetch error:", err);
    res.status(500).json({ msg: "Failed to fetch messages", error: err.message });
  }
};


// GET /api/messages/conversations
export const getConversations = async (req, res) => {
  
  try {
   const conversations = await Conversation.find({
  members: { $in: [userId] },
})
.populate("members", "name profilePhoto _id") // <-- this is KEY
.sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch conversations", error: err.message });
  }
};




export const startConversation = async (req, res) => {
  const { receiverId } = req.body;
 console.log("👉 Start conversation body:", req.body);
  console.log("👉 Authenticated user:", req.user);
  if (!receiverId) {
    return res.status(400).json({ msg: "Receiver ID is required" });
  }

  try {
    const existing = await Conversation.findOne({
      members: { $all: [req.user._id, receiverId] },
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    const newConv = await Conversation.create({
      members: [req.user._id, receiverId],
    });

    res.status(201).json(newConv);
  } catch (err) {
    console.error("Conversation start error:", err);
    res.status(500).json({ msg: "Failed to start conversation", error: err.message });
  }
};
