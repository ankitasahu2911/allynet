import { useEffect, useState } from "react";
import { getConversations } from "../../utils/api";

export default function ConversationList({ token, onSelect }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getConversations(token);
      setConversations(data);
    };
    fetchData();
  }, [token]);

  return (
    <div className="w-1/3 border-r p-4">
      <h2 className="font-bold mb-2">Conversations</h2>
      {conversations.map((conv) => (
        <div key={conv._id} onClick={() => onSelect(conv._id)} className="cursor-pointer hover:bg-gray-100 p-2 rounded">
          {conv.members.join(", ")}
        </div>
      ))}
    </div>
  );
}
