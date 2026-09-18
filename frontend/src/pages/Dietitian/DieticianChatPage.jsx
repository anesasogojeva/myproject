import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import DieticianInbox from "./DieticianInbox";
import DieticianChat from "./DieticianChat";
import EmptyState from "../../components/UI/EmptyState";

export default function DieticianChatPage({ token }) {
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <div className="card p-0 flex h-[75vh] overflow-hidden">
      <DieticianInbox token={token} onSelectUser={setSelectedUserId} selectedUserId={selectedUserId} />

      {selectedUserId ? (
        <DieticianChat token={token} userId={selectedUserId} />
      ) : (
        <div className="hidden sm:flex flex-1 items-center justify-center">
          <EmptyState
            icon={MessageCircle}
            title="Select a conversation"
            description="Choose a client from the inbox to view and reply to their messages."
          />
        </div>
      )}
    </div>
  );
}
