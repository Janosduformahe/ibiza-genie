
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Character, characterDetails } from "@/types/character";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  selectedCharacter: Character;
}

export const ChatInput = ({ onSend, disabled, placeholder, selectedCharacter }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const characterInfo = characterDetails[selectedCharacter];

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
      className={`p-4 border-t border-white/20 ${
        selectedCharacter === "tanit" ? "bg-black/20" : "bg-black/40"
      } backdrop-blur-sm sticky bottom-0 rounded-b-xl z-10`}
      style={{ 
        position: "sticky", 
        bottom: 0,
        paddingBottom: "env(safe-area-inset-bottom, 1rem)" 
      }}
    >
      <div className="flex space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder || "Escribe tu mensaje..."}
          className="flex-1 bg-white/20 border-white/20 text-white placeholder:text-white/60 focus:border-white"
          disabled={disabled}
        />
        <Button 
          type="submit" 
          disabled={disabled || !message.trim()}
          className={`${
            selectedCharacter === "tanit" 
              ? "bg-tanit-primary hover:bg-tanit-secondary" 
              : "bg-bess-primary hover:bg-bess-primary/90"
          } text-white`}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
