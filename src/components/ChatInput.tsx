
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowUp } from "lucide-react";
import { Character, characterDetails } from "@/types/character";
import { useLanguage } from "@/hooks/useLanguage";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  selectedCharacter: Character;
}

export const ChatInput = ({ onSend, disabled, placeholder, selectedCharacter }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { t } = useLanguage();
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
      className="sticky bottom-0 p-4 w-full bg-black backdrop-blur-sm z-10"
      style={{ 
        paddingBottom: "env(safe-area-inset-bottom, 1rem)" 
      }}
    >
      <div className="max-w-3xl mx-auto relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder || t('chat.typeMessage')}
          className="pr-12 py-6 pl-4 bg-gray-800/80 border border-gray-700 text-white rounded-full focus:ring-2 focus:ring-white/30 focus:border-white/30"
          disabled={disabled}
        />
        <Button 
          type="submit" 
          disabled={disabled || !message.trim()}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-full bg-white text-black hover:bg-gray-200"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};
