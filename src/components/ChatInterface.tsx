import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sun } from "lucide-react";

interface Message {
  content: string;
  isUser: boolean;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "¡Hola! I'm Biza, your Ibiza AI guide. Named after this magical island, I'm here to help you discover the best parties, events, and hidden gems. What would you like to know about our paradise? 🌴✨",
      isUser: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { content, isUser: true }]);

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: content }
      });

      if (error) {
        console.error('Chat function error:', error);
        throw error;
      }

      setMessages((prev) => [
        ...prev,
        {
          content: data.response || "Lo siento! I'm having trouble processing your request right now.",
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
      <div className="flex items-center justify-center p-4 border-b border-white/20 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-t-xl">
        <Sun className="h-6 w-6 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Chat with Biza</h2>
      </div>
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