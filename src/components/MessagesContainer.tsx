import { ChatMessage } from "./ChatMessage";

interface Message {
  content: string;
  isUser: boolean;
}

interface MessagesContainerProps {
  messages: Message[];
  isLoading: boolean;
  isExpanded: boolean;
}

export const MessagesContainer = ({ messages, isLoading, isExpanded }: MessagesContainerProps) => {
  return (
    <div className="messages-container flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <ChatMessage key={index} {...message} />
      ))}
      {isLoading && (
        <div className="typing-indicator glass-card">
          <div className="flex items-center space-x-2">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        </div>
      )}
    </div>
  );
};