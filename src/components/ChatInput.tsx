import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white/50 backdrop-blur-sm sticky bottom-0">
      <div className="flex space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about parties, clubs, or events in Ibiza..."
          className="flex-1"
          disabled={disabled}
        />
        <Button 
          type="submit" 
          disabled={disabled || !message.trim()}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};