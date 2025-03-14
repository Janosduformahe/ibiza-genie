
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Character } from "@/types/character";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  selectedCharacter: Character;
}

export const ChatInput = ({ onSend, disabled, placeholder }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="absolute bottom-0 left-0 right-0 p-6 bg-[#1E1E1E]"
    >
      <div className="max-w-3xl mx-auto relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder || "Escribe tu mensaje..."}
          className="w-full bg-[#2A2A2A] border-white/10 text-white placeholder:text-white/60 pr-12 py-6"
          disabled={disabled}
        />
        <Button 
          type="submit" 
          disabled={disabled || !message.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#4A65FF] hover:bg-[#4A65FF]/90 text-white"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
