export const sendMessage = async (token, receiverId, text) => {
  const res = await fetch("/api/message/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ receiverId, text }),
  });

  return res.json();
};

export const getConversations = async (token) => {
  const res = await fetch("/api/message/conversations", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const getMessages = async (token, conversationId) => {
  const res = await fetch(`/api/message/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
