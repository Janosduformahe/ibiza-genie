import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sun, MessageCircle, Palmtree, Sunset, Waves } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

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

  return (
    <Card 
      className={cn(
        "chat-container glass-card transition-all duration-500 ease-in-out",
        isExpanded ? "fixed inset-0 m-0 rounded-none z-50" : "max-w-2xl mx-auto"
      )}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-ibiza-azure to-ibiza-night rounded-t-xl">
        <div className="flex items-center space-x-2">
          <Sun className="h-6 w-6 text-white animate-pulse" />
          <Palmtree className="h-6 w-6 text-white animate-bounce" />
          <h2 className="text-lg font-semibold text-white">Chat with Biza</h2>
          <Waves className="h-6 w-6 text-white animate-pulse" />
          <Sunset className="h-6 w-6 text-white animate-bounce" />
        </div>
        {isExpanded && (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Connect with WhatsApp</DialogTitle>
                  <DialogDescription>
                    Get Biza's responses directly on WhatsApp! Enter your phone number with country code (e.g., +34612345678)
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="+34612345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <Button onClick={handleWhatsAppConnect}>
                    Connect
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
      <div className={cn(
        "messages-container transition-all duration-500",
        isExpanded ? "h-[calc(100vh-8rem)]" : "h-[400px]"
      )}>
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
        {isLoading && (
          <div className="typing-indicator glass-card">
            <div className="flex items-center space-x-2">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}
      </div>
      <ChatInput 
        onSend={handleSendMessage} 
        disabled={isLoading} 
        placeholder={isExpanded ? "Ask about parties, clubs, or events in Ibiza..." : "Click to start chatting with Biza..."}
      />
    </Card>
  );
};