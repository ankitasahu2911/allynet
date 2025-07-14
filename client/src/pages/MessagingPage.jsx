import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useMessage } from "../context/MessageContext";

export default function MessagingPage() {
  const { token, user } = useContext(AuthContext);
  const { setHasNewMessage } = useMessage(); // ✅ Global context

  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [searchParams] = useSearchParams();
  const receiverId = searchParams.get("user");

  const API = "http://localhost:5000/api/message";

  // 🔹 Fetch conversations
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setConversations(res.data);

        // ✅ Check for new message if not in a chat
        if (!selectedConv) {
          const hasNew = res.data.some((conv) => {
            const lastMsg = conv.lastMessage;
            return lastMsg && String(lastMsg.sender) !== String(user._id);
          });
          setHasNewMessage(hasNew);
        }
      })
      .catch((err) => console.error("Conversation load error", err));
  }, [token, selectedConv]);

  // 🔹 Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConv || !token) return;

    axios
      .get(`${API}/${selectedConv._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessages(res.data);
        setHasNewMessage(false); // ✅ Mark messages as read
      })
      .catch((err) => console.error("Message fetch error", err));
  }, [selectedConv, token]);

  // 🔹 Send message
  const handleSend = async () => {
    if (!text.trim() || !selectedConv) return;

    const otherUser = selectedConv.members.find((m) => m._id !== user._id);
    if (!otherUser) return;

    try {
      const res = await axios.post(
        `${API}/send`,
        { receiverId: otherUser._id, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, res.data.message]);
      setText("");
    } catch (err) {
      console.error("Send error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
  if (!receiverId || !conversations.length || !user) return;

  const existingConv = conversations.find((conv) =>
    conv.members.some((m) => m._id === receiverId)
  );

  if (existingConv) {
    setSelectedConv(existingConv);
  }
}, [receiverId, conversations, user]);


  return (
    <div className="h-screen flex">
      {/* Left Panel */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">Conversations</h2>
        {conversations.length === 0 && (
          <p className="text-gray-500">No conversations yet.</p>
        )}
        {conversations.map((conv) => {
          const otherUser = conv.members.find(
            (m) => m && String(m._id) !== String(user._id)
          );

          return (
            <div
              key={conv._id}
              className={`flex items-center gap-4 p-2 border rounded mb-2 cursor-pointer ${
                selectedConv?._id === conv._id ? "bg-indigo-100" : ""
              }`}
              onClick={() => {
                // optional: mark conversation as read on backend
                axios.post(
                  `${API}/${conv._id}/mark-read`,
                  {},
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setSelectedConv(conv);
              }}
            >
              <img
                src={
                  otherUser?.profilePhoto
                    ? `http://localhost:5000/uploads/${otherUser.profilePhoto}`
                    : "/default-avatar.png"
                }
                alt={otherUser?.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="font-medium">{otherUser?.name || "User"}</p>
            </div>
          );
        })}
      </div>

      {/* Right Panel */}
      <div className="w-2/3 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2 flex flex-col p-2">
          {messages.map((msg) => {
            const isMe = String(msg.sender) === String(user._id);
            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                    isMe
                      ? "bg-green-200 text-right rounded-br-none"
                      : "bg-blue-200 text-left rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        {selectedConv && (
          <div className="mt-4 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 border px-3 py-2 rounded"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSend}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
