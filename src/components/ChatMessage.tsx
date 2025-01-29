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
          ? "user-message ml-auto bg-ibiza-azure text-white" 
          : "bot-message mr-auto glass-card"
      )}
    >
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
};