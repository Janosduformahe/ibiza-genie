
import React from "react";
import { Sun, Palmtree, Music, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Character, characterDetails } from "@/types/character";
import { useLanguage } from "@/hooks/useLanguage";

interface CharacterSelectorProps {
  selectedCharacter: Character;
  onSelectCharacter: (character: Character) => void;
}

export const CharacterSelector = ({ selectedCharacter, onSelectCharacter }: CharacterSelectorProps) => {
  const { t } = useLanguage();
  
  const handleCharacterChange = (character: Character) => {
    if (character !== selectedCharacter) {
      onSelectCharacter(character);
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
      <Button
        onClick={() => handleCharacterChange("tanit")}
        className={`relative overflow-hidden h-auto p-0 ${
          selectedCharacter === "tanit"
            ? "border-2 border-white shadow-lg" 
            : "border border-white/20 hover:border-tanit-primary/70"
        } rounded-lg transition-all duration-300`}
      >
        <div className="w-full h-full">
          <div className="relative">
            <div className="flex items-center justify-center p-2 bg-gradient-to-b from-tanit-primary/20 to-tanit-primary/60">
              <img 
                src={characterDetails.tanit.avatar} 
                alt="Tanit, diosa de la naturaleza" 
                className="w-28 h-28 md:w-32 md:h-32 object-contain"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-tanit-primary/90 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-left">
              <h3 className="font-bold text-2xl text-white">{t('characters.tanit.name')}</h3>
              <p className="text-sm text-white/90 max-w-xs">{t('characters.tanit.description')}</p>
              <div className="flex mt-2 gap-1">
                <Sun className="h-5 w-5 text-white" />
                <Palmtree className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
        {selectedCharacter === "tanit" && (
          <div className="absolute top-2 right-2 bg-white text-tanit-primary text-xs px-2 py-1 rounded-full">
            {t('chat.active')}
          </div>
        )}
      </Button>

      <Button
        onClick={() => handleCharacterChange("dionisio")}
        className={`relative overflow-hidden h-auto p-0 ${
          selectedCharacter === "dionisio"
            ? "border-2 border-white shadow-lg" 
            : "border border-white/20 hover:border-bess-primary/70"
        } rounded-lg transition-all duration-300`}
      >
        <div className="w-full h-full">
          <div className="relative">
            <div className="flex items-center justify-center p-2 bg-gradient-to-b from-bess-primary/20 to-bess-primary/60">
              <img 
                src={characterDetails.dionisio.avatar} 
                alt="Dionisio, dios de la fiesta" 
                className="w-28 h-28 md:w-32 md:h-32 object-contain"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-bess-primary/90 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-left">
              <h3 className="font-bold text-2xl text-white">{t('characters.dionisio.name')}</h3>
              <p className="text-sm text-white/90 max-w-xs">{t('characters.dionisio.description')}</p>
              <div className="flex mt-2 gap-1">
                <Music className="h-5 w-5 text-white" />
                <Flame className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
        {selectedCharacter === "dionisio" && (
          <div className="absolute top-2 right-2 bg-white text-bess-primary text-xs px-2 py-1 rounded-full">
            {t('chat.active')}
          </div>
        )}
      </Button>
      
      {selectedCharacter && (
        <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white text-center">
          <p>{characterDetails[selectedCharacter].briefDescription}</p>
        </div>
      )}
    </div>
  );
};
