import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { MessagesContainer } from "./MessagesContainer";

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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }
    
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

  const handleWhatsAppConnect = async () => {
    try {
      if (!phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
        throw new Error("Please enter a valid phone number with country code");
      }

      const { data, error } = await supabase.functions.invoke('whatsapp', {
        body: { 
          message: {
            phoneNumber: phoneNumber
          }
        }
      });

      if (error) throw error;

      toast({
        title: "WhatsApp Connected!",
        description: "You'll receive a message from Biza on WhatsApp shortly.",
      });
    } catch (error) {
      console.error('WhatsApp error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to connect WhatsApp. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
  };

  return (
    <Card 
      className={cn(
        "chat-container glass-card transition-all duration-500 ease-in-out",
        isExpanded ? "fixed inset-0 m-0 rounded-none z-50 min-h-screen" : "max-w-2xl mx-auto"
      )}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      <div className="flex flex-col h-full">
        <ChatHeader 
          isExpanded={isExpanded}
          onClose={handleClose}
          onWhatsAppConnect={handleWhatsAppConnect}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
        <MessagesContainer 
          messages={messages}
          isLoading={isLoading}
          isExpanded={isExpanded}
        />
        <ChatInput 
          onSend={handleSendMessage} 
          disabled={isLoading} 
          placeholder={isExpanded ? "Ask about parties, clubs, or events in Ibiza..." : "Click to start chatting with Biza..."}
        />
      </div>
    </Card>
  );
};