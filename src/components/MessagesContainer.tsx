
import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { Character } from "@/types/character";

interface Message {
  content: string;
  isUser: boolean;
}

interface MessagesContainerProps {
  messages: Message[];
  isLoading: boolean;
  isExpanded: boolean;
  selectedCharacter: Character;
}

export const MessagesContainer = ({ messages, isLoading, selectedCharacter }: MessagesContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages-container px-4 pb-32">
      <div className="max-w-3xl mx-auto">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            content={message.content} 
            isUser={message.isUser} 
            selectedCharacter={selectedCharacter}
          />
        ))}
        {isLoading && (
          <div className="typing-indicator flex space-x-2 items-center p-4 text-white/50">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
