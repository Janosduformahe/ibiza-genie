
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

export const ChatMessage = ({ content, isUser }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "message p-4 rounded-lg my-2 max-w-[80%]",
        isUser 
          ? "user-message ml-auto bg-ibiza-azure text-white font-medium" 
          : "bot-message mr-auto glass-card text-white font-medium"
      )}
    >
      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
};
