import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Send, MessageCircle } from "lucide-react";
import EmptyState from "../../components/UI/EmptyState";

const socket = io("http://localhost:5000");

export default function DieticianChat({ token: tokenProp, userId }) {
  const token = tokenProp || localStorage.getItem("accessToken");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingStatus, setTypingStatus] = useState("");

  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!userId) return;

    socket.emit("join", { userId });
    loadMessages();

    const receiveHandler = (msg) => setMessages((prev) => [...prev, msg]);

    const typingHandler = ({ role }) => {
      if (role !== "dietician") setTypingStatus("User is typing...");
    };

    const stopTypingHandler = ({ role }) => {
      if (role !== "dietician") setTypingStatus("");
    };

    socket.on("receiveMessage", receiveHandler);
    socket.on("userTyping", typingHandler);
    socket.on("userStopTyping", stopTypingHandler);

    return () => {
      socket.off("receiveMessage", receiveHandler);
      socket.off("userTyping", typingHandler);
      socket.off("userStopTyping", stopTypingHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadMessages = async () => {
    try {
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
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      userId,
      role: "dietician",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    socket.emit("sendMessage", msg);
    socket.emit("stopTyping", { userId, role: "dietician" });
    setInput("");
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socket.emit("typing", { userId, role: "dietician" });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { userId, role: "dietician" });
    }, 700);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      <div className="px-5 py-4 border-b border-stone-100 shrink-0">
        <p className="font-semibold text-stone-900 text-sm">Client Conversation</p>
        <p className="text-xs text-stone-400">{typingStatus || " "}</p>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 flex flex-col gap-3">
        {messages.length === 0 ? (
          <EmptyState icon={MessageCircle} title="No messages yet" description="Start the conversation with this client." />
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "dietician" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "dietician"
                    ? "bg-emerald-700 text-white rounded-br-sm"
                    : "bg-stone-100 text-stone-700 rounded-bl-sm"
                }`}
              >
                <p>{m.text}</p>
                <span className={`block text-[10px] mt-1 ${m.role === "dietician" ? "text-emerald-100" : "text-stone-400"}`}>
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
          value={input}
          onChange={handleTyping}
          placeholder="Type a message…"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 transition disabled:opacity-40 shrink-0"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
