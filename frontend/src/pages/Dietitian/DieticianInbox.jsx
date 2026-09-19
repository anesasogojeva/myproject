import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { MessageSquare, Search } from "lucide-react";
import EmptyState from "../../components/UI/EmptyState";
import PaginationBar from "../../components/UI/PaginationBar";
import usePagination from "../../hooks/usePagination";
import { API_URL } from "../../config";

const socket = io(API_URL);

export default function DieticianInbox({ token: tokenProp, onSelectUser, selectedUserId }) {
  const token = tokenProp || localStorage.getItem("accessToken");
  const [inbox, setInbox] = useState([]);
  const [search, setSearch] = useState("");

  const filteredInbox = inbox.filter((item) =>
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const {
    page,
    setPage,
    totalPages,
    pageItems: pagedInbox,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
  } = usePagination(filteredInbox, 10);

  useEffect(() => {
    loadInbox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInbox = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/chat/inbox`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInbox(res.data);
    } catch (err) {
      console.error("Failed to load inbox:", err);
    }
  };

  useEffect(() => {
    const handleMessage = (msg) => {
      setInbox((prev) => {
        const filtered = prev.filter((u) => u.userId !== msg.userId);
        const updatedUser = {
          userId: msg.userId,
          name: prev.find((u) => u.userId === msg.userId)?.name || "User",
          lastMessage: msg.text,
        };
        return [updatedUser, ...filtered];
      });
    };

    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, []);

  return (
    <div className="w-full sm:w-80 border-r border-stone-100 h-full flex flex-col shrink-0">
      <div className="p-4 border-b border-stone-100 shrink-0 space-y-3">
        <h2 className="font-display font-bold text-stone-900">Inbox</h2>
        {inbox.length > 5 && (
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="field-input pl-10"
            />
          </div>
        )}
      </div>

      {inbox.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Client messages will appear here."
        />
      ) : filteredInbox.length === 0 ? (
        <EmptyState icon={Search} title="No matching conversations" description="Try a different search term." />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto scroll-thin p-2">
            {pagedInbox.map((item) => (
              <button
                key={item.userId}
                onClick={() => onSelectUser(item.userId)}
                className={`w-full text-left p-3 rounded-xl transition mb-1 ${
                  selectedUserId === item.userId ? "bg-emerald-50 border border-emerald-200" : "hover:bg-stone-50 border border-transparent"
                }`}
              >
                <div className="font-medium text-stone-800 text-sm truncate">{item.name}</div>
                <div className="text-xs text-stone-400 truncate mt-0.5">{item.lastMessage}</div>
              </button>
            ))}
          </div>
          <div className="shrink-0 px-2 pb-3">
            <PaginationBar
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalItems={totalItems}
              size="sm"
              layout="stack"
              className="mt-3"
            />
          </div>
        </>
      )}
    </div>
  );
}
