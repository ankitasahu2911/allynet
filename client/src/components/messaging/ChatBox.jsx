import { useEffect, useState } from "react";
import { getMessages, sendMessage } from "../../utils/api";

export default function ChatBox({ token, conversationId, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!conversationId) return;
    const fetchData = async () => {
      const data = await getMessages(token, conversationId);
      setMessages(data);
    };
    fetchData();
  }, [conversationId]);

  const handleSend = async () => {
    if (!text) return;

    const receiverId = messages.find(m => m.sender !== userId)?.sender; // crude fallback

    const res = await sendMessage(token, receiverId, text);
    setMessages((prev) => [...prev, res.message]);
    setText("");
  };

  return (
    <div className="w-2/3 p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((m) => (
          <div key={m._id} className={`p-2 rounded ${m.sender === userId ? "bg-blue-100 ml-auto" : "bg-gray-100"}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type a message"
        />
        <button onClick={handleSend} className="ml-2 bg-indigo-600 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}

