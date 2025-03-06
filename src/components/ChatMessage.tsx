
import { cn } from "@/lib/utils";
import { Character, characterDetails } from "@/types/character";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  selectedCharacter: Character;
}

export const ChatMessage = ({ content, isUser, selectedCharacter }: ChatMessageProps) => {
  const characterInfo = characterDetails[selectedCharacter];
  
  return (
    <div
      className={cn(
        "message p-4 rounded-lg my-2 max-w-[80%]",
        isUser 
          ? `user-message ml-auto ${characterInfo.userMessageBackground} text-white font-medium` 
          : `bot-message mr-auto ${characterInfo.messageBackground} text-white font-medium`
      )}
    >
      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
};
