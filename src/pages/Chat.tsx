
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
    <div className={`min-h-screen bg-gradient-to-br ${characterInfo.background}`}>
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            {t(`chat.with${selectedCharacter.charAt(0).toUpperCase() + selectedCharacter.slice(1)}`)} - {t('chat.chooseGuide')}
          </h1>
          
          <CharacterSelector 
            selectedCharacter={selectedCharacter}
            onSelectCharacter={setSelectedCharacter}
          />
          
          <div className={`${characterInfo.messageBackground} backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20`}>
            <ChatInterface 
              fullPage={true}
              selectedCharacter={selectedCharacter}
              onChangeCharacter={setSelectedCharacter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
