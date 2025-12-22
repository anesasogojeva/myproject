import React, { useState } from "react";
import DieticianInbox from "./DieticianInbox";
import DieticianChat from "./DieticianChat";

export default function DieticianChatPage({ token }) {
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <div className="flex h-screen">
      <DieticianInbox token={token} onSelectUser={setSelectedUserId} />

      {selectedUserId ? (
        <DieticianChat token={token} userId={selectedUserId} />
      ) : (
        <div className="flex justify-center items-center w-2/3 text-gray-500">
          Select a user to start chatting
        </div>
      )}
    </div>
  );
}
