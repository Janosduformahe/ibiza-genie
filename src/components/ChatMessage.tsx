import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

export const ChatMessage = ({ content, isUser }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "message",
        isUser ? "user-message" : "bot-message"
      )}
    >
      <p className="text-sm leading-relaxed">{content}</p>
    </div>
  );
};