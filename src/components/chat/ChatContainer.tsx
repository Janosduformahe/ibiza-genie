
import { useEffect, useRef } from "react";
import { ChatHeader } from "../ChatHeader";
import { MessagesContainer } from "../MessagesContainer";
import { ChatInput } from "../ChatInput";
import { Button } from "@/components/ui/button";
import { Character } from "@/types/character";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/contexts/AuthContext";
import { Message } from "@/hooks/useChatMessages";

interface ChatContainerProps {
  messages: Message[];
  loading: boolean;
  selectedCharacter: Character;
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  onChangeCharacter?: (character: Character) => void;
  fullPage?: boolean;
}

export const ChatContainer = ({
  messages,
  loading,
  selectedCharacter,
  onSendMessage,
  onClearChat,
  onChangeCharacter,
  fullPage
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { user } = useAuth();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative h-full flex flex-col bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden rounded-lg shadow-lg border border-gray-800">
      <ChatHeader 
        selectedCharacter={selectedCharacter} 
        isExpanded={fullPage}
        onChangeCharacter={onChangeCharacter}
      />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessagesContainer 
          messages={messages} 
          loading={loading}
          selectedCharacter={selectedCharacter}
          scrollRef={messagesEndRef}
        />
      </div>
      
      <div className="p-4 border-t border-gray-800 bg-gray-900 space-y-2">
        {!user && (
          <div className="text-center mb-4 p-2 bg-blue-900/40 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">{t("auth.signInToSaveChats")}</p>
            <div className="flex justify-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={() => window.location.href = '/auth'}
              >
                {t("auth.signIn")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={() => window.location.href = '/auth'}
              >
                {t("auth.signUp")}
              </Button>
            </div>
          </div>
        )}
        <ChatInput 
          onSendMessage={onSendMessage} 
          onClearChat={onClearChat} 
          disabled={loading}
          selectedCharacter={selectedCharacter}
        />
      </div>
    </div>
  );
};
