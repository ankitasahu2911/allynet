import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

const Studentchat = () => {
  const { user, token } = useContext(AuthContext);
  const { receiverId } = useParams(); // Make sure your route provides this param

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (receiverId && token) fetchMessages();
  }, [receiverId, token]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/messages",
        { receiverId, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg) => (
            <p key={msg._id} className={msg.sender === user._id ? "self" : "other"}>
              {msg.content}
            </p>
          ))}
        </div>
        <div className="input-bar">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Studentchat;