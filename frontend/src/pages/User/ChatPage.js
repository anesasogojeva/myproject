import React from "react";
import Chat from "../../components/Chat/Chat";
import useAuth from "../../hooks/useAuth";

export default function ChatPage() {
  const { user } = useAuth();

  if (!user) return <p>Please log in to chat.</p>;

  return <Chat userId={user.id} role="user" />;
}
