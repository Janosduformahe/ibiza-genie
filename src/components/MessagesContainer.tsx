
import { useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { Character } from "@/types/character";
import { Message } from "@/hooks/useChatMessages";

interface MessagesContainerProps {
  messages: Message[];
  loading?: boolean;
  isLoading?: boolean;
  isExpanded?: boolean;
  selectedCharacter?: Character;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

export const MessagesContainer = ({ 
  messages, 
  loading, 
  isLoading, 
  selectedCharacter,
  scrollRef
}: MessagesContainerProps) => {
  const actualLoading = loading || isLoading;

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, scrollRef]);

  return (
    <div className="messages-container flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <ChatMessage 
          key={index} 
          content={message.content} 
          isUser={message.isUser} 
          selectedCharacter={selectedCharacter || message.character as Character}
        />
      ))}
      {actualLoading && (
        <div className="typing-indicator flex space-x-2 items-center p-3 bg-gray-800/50 rounded-lg w-20">
          <div className="typing-dot w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
          <div className="typing-dot w-2 h-2 bg-white/70 rounded-full animate-pulse delay-150"></div>
          <div className="typing-dot w-2 h-2 bg-white/70 rounded-full animate-pulse delay-300"></div>
        </div>
      )}
      <div ref={scrollRef} />
    </div>
  );
};
