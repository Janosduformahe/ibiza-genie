import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

      // Call DeepSeek API through Edge Function
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: content }
      });

      if (error) throw error;

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          content: data.response || "I apologize, but I'm having trouble processing your request right now.",
          isUser: false,
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
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