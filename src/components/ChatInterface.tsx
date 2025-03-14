
import { useState, useEffect } from "react";
import { CharacterSelector } from "./CharacterSelector";
import { Character } from "@/types/character";
import { useChatMessages } from "@/hooks/useChatMessages";
import { ChatContainer } from "./chat/ChatContainer";

interface ChatInterfaceProps {
  fullPage?: boolean;
  selectedCharacter?: Character;
  onChangeCharacter?: (character: Character) => void;
}

export const ChatInterface = ({ 
  fullPage, 
  selectedCharacter: externalCharacter,
  onChangeCharacter
}: ChatInterfaceProps = {}) => {
  const [character, setCharacter] = useState<Character>(externalCharacter || "tanit");
  const { messages, loading, sendMessage, clearMessages } = useChatMessages(character);

  useEffect(() => {
    if (externalCharacter && externalCharacter !== character) {
      setCharacter(externalCharacter);
    }
  }, [externalCharacter]);

  const handleCharacterChange = (newCharacter: Character) => {
    setCharacter(newCharacter);
    if (onChangeCharacter) {
      onChangeCharacter(newCharacter);
    }
  };

  return (
    <div className="relative h-full flex flex-col bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden rounded-lg shadow-lg border border-gray-800">
      <CharacterSelector 
        selectedCharacter={character} 
        onSelectCharacter={handleCharacterChange}
      />
      
      <ChatContainer
        messages={messages}
        loading={loading}
        selectedCharacter={character}
        onSendMessage={sendMessage}
        onClearChat={clearMessages}
        onChangeCharacter={handleCharacterChange}
        fullPage={fullPage}
      />
    </div>
  );
};

export type { Message } from "@/hooks/useChatMessages";
