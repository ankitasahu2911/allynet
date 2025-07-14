// src/context/MessageContext.jsx
import { createContext, useState, useContext } from "react";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [hasNewMessage, setHasNewMessage] = useState(false);

  return (
    <MessageContext.Provider value={{ hasNewMessage, setHasNewMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

// Optional shortcut hook
export const useMessage = () => useContext(MessageContext);
