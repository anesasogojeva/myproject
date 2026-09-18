import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../hooks/socket";
import { Send, MessageCircle } from "lucide-react";
import EmptyState from "../UI/EmptyState";

export default function Chat({ userId, role }) {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [typingStatus, setTypingStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [chat]);

  useEffect(() => {
    if (!userId) return;

    const loadChat = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/chat/${userId}`);
        const data = await res.json();
        setChat(
          data.map((m) => ({
            role: m.senderRole,
            text: m.message,
            time: m.time,
          }))
        );
      } catch (err) {
        console.log("Chat load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    socket.connect();
    socket.emit("join", { userId });

    const receiveHandler = (msg) => setChat((prev) => [...prev, msg]);

    const typingHandler = (data) => {
      if (!data) return;
      const { role: typingRole } = data;
      if (typingRole && typingRole !== role) {
        setTypingStatus(`${typingRole} is typing...`);
      }
    };

    const stopTypingHandler = (data) => {
      if (!data) return;
      const { role: typingRole } = data;
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

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      userId,
      role,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    socket.emit("sendMessage", msgData);
    setMessage("");
    socket.emit("stopTyping", { userId, role });
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", { userId, role });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { userId, role });
    }, 700);
  };

  return (
    <div className="max-w-2xl mx-auto card flex flex-col h-[70vh] overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2.5 shrink-0">
        <span className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <MessageCircle className="w-5 h-5" />
        </span>
        <div>
          <p className="font-semibold text-stone-900 text-sm">Your Dietitian</p>
          <p className="text-xs text-stone-400">{typingStatus || "Ask anything about your nutrition plan"}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 flex flex-col gap-3">
        {loading ? null : chat.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="No messages yet"
            description="Send a message to start the conversation with your dietitian."
          />
        ) : (
          chat.map((m, i) => (
            <div key={i} className={`flex ${m.role === role ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === role
                    ? "bg-emerald-700 text-white rounded-br-sm"
                    : "bg-stone-100 text-stone-700 rounded-bl-sm"
                }`}
              >
                <p>{m.text}</p>
                <span className={`block text-[10px] mt-1 ${m.role === role ? "text-emerald-100" : "text-stone-400"}`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-stone-100 flex items-center gap-2 shrink-0">
        <input
          className="field-input flex-1"
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={!message.trim()}
          className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 transition disabled:opacity-40 shrink-0"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
