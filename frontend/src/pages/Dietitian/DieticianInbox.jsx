import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function DieticianInbox({ token, onSelectUser }) {
  const [inbox, setInbox] = useState([]);

  useEffect(() => {
    loadInbox();
  }, []);

  const loadInbox = async () => {
    const res = await axios.get("http://localhost:5000/api/chat/inbox", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setInbox(res.data);
  };

  useEffect(() => {
    const handleMessage = (msg) => {
      setInbox((prev) => {
        // Remove user if already in the inbox
        const filtered = prev.filter((u) => u.userId !== msg.userId);

        const updatedUser = {
          userId: msg.userId,
          name: filtered.find((u) => u.userId === msg.userId)?.name || "User",
          lastMessage: msg.text,
        };

        // Add the user at the top
        return [updatedUser, ...filtered];
      });
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, []);

  return (
    <div className="p-4 border-r w-1/3 h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Inbox</h2>

      {inbox.map((item) => (
        <div
          key={item.userId}
          onClick={() => onSelectUser(item.userId)}
          className="p-3 mb-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
        >
          <div className="font-semibold">{item.name}</div>
          <div className="text-sm text-gray-600">{item.lastMessage}</div>
        </div>
      ))}
    </div>
  );
}
