import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../hooks/socket";

export default function Chat({ userId, role }) {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [typingStatus, setTypingStatus] = useState("");

  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [chat]);

  // --- LOAD CHAT HISTORY ---
  useEffect(() => {
    if (!userId) return;

    const loadChat = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/chat/${userId}`);
        const data = await res.json();
        setChat(
  data.map(m => ({
    role: m.senderRole,     // backend → frontend
    text: m.message,        // backend → frontend
    time: m.time
  }))
);  
      } catch (err) {
        console.log("Chat load error:", err);
      }
    };

    loadChat();
  }, [userId]);
  
// --- SOCKET SETUP ---
useEffect(() => {
  if (!userId) return;

  socket.connect();
  socket.emit("join", { userId });

  const receiveHandler = (msg) => setChat(prev => [...prev, msg]);

  const typingHandler = (data) => {
    if (!data) return;                  
    const { role: typingRole } = data;
    // only show typing if the other person is typing
    if (typingRole && typingRole !== role) {
      setTypingStatus(`${typingRole} is typing...`);
    }
  };

  const stopTypingHandler = (data) => {
    if (!data) return;
    const { role: typingRole } = data;
    // only stop typing if the other person stops
    if (typingRole && typingRole !== role) {
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
    socket.disconnect();
  };
}, [userId, role]);



  // --- SEND MESSAGE ---
  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      userId,
      role,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("sendMessage", msgData);
    setMessage("");
    socket.emit("stopTyping", { userId, role });
  };

  // --- TYPING ---
  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", { userId, role });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { userId, role });
    }, 700);
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messages}>
        {chat.map((m, i) => (
          <div
  key={i}
  style={{
    ...styles.message,
    alignSelf:
      m.role === role // if message role is same as logged-in role → right
        ? "flex-end"
        : "flex-start",
    background:
      m.role === role
        ? "#e1f5fe" // your own messages color
        : "#fff8e1", // other side color
  }}
>
  <div style={styles.text}>{m.text}</div>
  <small style={styles.time}>{m.time}</small>
</div>

        ))}
        <div ref={messagesEndRef} />
      </div>

      {typingStatus && <div style={styles.typing}>{typingStatus}</div>}

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
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
    maxWidth: "600px",
    margin: "20px auto",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    background: "#fff",
  },
  messages: {
    height: "400px",
    overflowY: "scroll",
    padding: "10px",
    borderBottom: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
  },
  message: {
    padding: "8px",
    marginBottom: "5px",
    borderRadius: "8px",
    maxWidth: "70%",
    wordBreak: "break-word",
  },
  user: {
    background: "#e1f5fe",
    alignSelf: "flex-end",
  },
  dietician: {
    background: "#fff8e1",
    alignSelf: "flex-start",
  },
  time: {
    fontSize: "10px",
    color: "#999",
    textAlign: "right",
  },
  inputRow: {
    display: "flex",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    marginLeft: "10px",
    padding: "10px 20px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
