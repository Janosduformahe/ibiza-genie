
import { ChatInterface } from "@/components/ChatInterface";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { CharacterSelector } from "@/components/CharacterSelector";
import { useState } from "react";
import { Character } from "@/types/character";

const Index = () => {
  const { t } = useLanguage();
  const [selectedCharacter, setSelectedCharacter] = useState<Character>("tanit");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0EA5E9] via-[#33C3F0] to-[#0FA0CE]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white mb-4">
            {t('home.heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            {t('home.heroSubtitle')}
          </p>
        </div>

        <CharacterSelector
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
        />

        <div className="relative w-full">
          <div className="chat-preview-container">
            <ChatInterface 
              fullPage={false}
              selectedCharacter={selectedCharacter}
              onChangeCharacter={setSelectedCharacter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
