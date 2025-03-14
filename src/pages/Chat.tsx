
import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { Navigation } from "@/components/Navigation";
import { CharacterSelector } from "@/components/CharacterSelector";
import { Character, characterDetails } from "@/types/character";
import { useLanguage } from "@/hooks/useLanguage";

const Chat = () => {
  const { t } = useLanguage();
  const [selectedCharacter, setSelectedCharacter] = useState<Character>("tanit");
  const characterInfo = characterDetails[selectedCharacter];

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex">
      {/* Sidebar */}
      <div className="w-72 bg-[#2A2A2A] border-r border-white/10 p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-4">Chat con IA</h1>
          <button 
            className="w-full bg-[#4A65FF] text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-[#4A65FF]/90 transition-colors"
          >
            <span>+ Nuevo chat</span>
          </button>
        </div>
        
        <CharacterSelector 
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
          className="mb-4"
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <Navigation className="bg-[#2A2A2A] border-b border-white/10" />
        
        <div className="flex-1 relative">
          <ChatInterface 
            fullPage={true} 
            selectedCharacter={selectedCharacter}
            onChangeCharacter={setSelectedCharacter}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
