import React from "react";
import { MessageCircle } from "lucide-react";
import Chat from "../../components/Chat/Chat";
import useAuth from "../../hooks/useAuth";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import EmptyState from "../../components/UI/EmptyState";

export default function ChatPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container-app py-14 flex justify-center">
        <Card className="max-w-md w-full">
          <EmptyState
            icon={MessageCircle}
            title="Please log in to chat"
            description="Sign in to message your dietitian and get personalized nutrition guidance."
            action={<Button to="/login">Log In</Button>}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="container-app py-10 sm:py-14">
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-stone-900 mb-8 text-center">
        Chat with Your Dietitian
      </h1>
      <Chat userId={user.id} role="user" />
    </div>
  );
}
