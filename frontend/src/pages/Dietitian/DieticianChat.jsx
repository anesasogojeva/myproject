import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

export default function DieticianChat({ token, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingStatus, setTypingStatus] = useState("");

  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // LOAD MESSAGES
  useEffect(() => {
    if (!userId) return;

    socket.emit("join", { userId });
    loadMessages();

    // Receive message
    const receiveHandler = (msg) =>
      setMessages((prev) => [...prev, msg]);

    // Someone is typing
    const typingHandler = ({ role }) => {
      if (role !== "dietician") {
        setTypingStatus("User is typing...");
      }
    };

    // Someone stopped typing
    const stopTypingHandler = ({ role }) => {
      if (role !== "dietician") {
        setTypingStatus("");
      }
    };

    socket.on("receiveMessage", receiveHandler);
    socket.on("userTyping", typingHandler);
    socket.on("userStopTyping", stopTypingHandler);

    return () => {
      socket.off("receiveMessage", receiveHandler);
      socket.off("userTyping", typingHandler);
      socket.off("userStopTyping", stopTypingHandler);
    };
  }, [userId]);

  const loadMessages = async () => {
    const res = await axios.get(`http://localhost:5000/api/chat/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMessages(
      res.data.map((m) => ({
        role: m.senderRole,
        text: m.message,
        time: m.time,
      }))
    );
  };

  // --- SEND MESSAGE ---
  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      userId,
      role: "dietician",
      text: input,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("sendMessage", msg);
    socket.emit("stopTyping", { userId, role: "dietician" });
    setInput("");
  };

  // --- TYPING HANDLER ---
  const handleTyping = (e) => {
    setInput(e.target.value);
    socket.emit("typing", { userId, role: "dietician" });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { userId, role: "dietician" });
    }, 700);
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messages}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf:
                m.role === "dietician" ? "flex-end" : "flex-start",
              background:
                m.role === "dietician" ? "#e1f5fe" : "#fff8e1",
            }}
          >
            <div>{m.text}</div>
            <small style={styles.time}>{m.time}</small>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {typingStatus && (
        <div style={styles.typing}>{typingStatus}</div>
      )}

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={handleTyping}
          placeholder="Type a message…"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    background: "#fff",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  messages: {
    flex: 1,
    overflowY: "scroll",
    padding: "10px",
    borderBottom: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
  },
  message: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "10px",
    maxWidth: "70%",
    wordBreak: "break-word",
  },
  time: {
    fontSize: "10px",
    textAlign: "right",
    color: "#888",
    marginTop: "4px",
  },
  typing: {
    padding: "5px 10px",
    color: "#999",
    fontStyle: "italic",
  },
  inputRow: {
    display: "flex",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    marginLeft: "10px",
    padding: "10px 20px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
