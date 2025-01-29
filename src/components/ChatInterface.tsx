import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  content: string;
  isUser: boolean;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your Ibiza AI concierge. How can I help you today?",
      isUser: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      // Add user message
      setMessages((prev) => [...prev, { content, isUser: true }]);

      // TODO: Integrate with DeepSeek API
      // For now, we'll simulate a response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            content: "I'm still being configured. Please try again later!",
            isUser: false,
          },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="chat-container glass-card">
      <div className="messages-container">
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <div className="typing-dot" style={{ animationDelay: "0ms" }} />
            <div className="typing-dot" style={{ animationDelay: "200ms" }} />
            <div className="typing-dot" style={{ animationDelay: "400ms" }} />
          </div>
        )}
      </div>
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </Card>
  );
};