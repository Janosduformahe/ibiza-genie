
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
  
  return (
    <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
      <Button
        onClick={() => onSelectCharacter("tanit")}
        className={`relative overflow-hidden h-auto p-0 ${
          selectedCharacter === "tanit"
            ? "border-2 border-white shadow-lg" 
            : "border border-white/20 hover:border-tanit-primary/70"
        } rounded-lg transition-all duration-300`}
      >
        <div className="w-full h-full">
          <div className="relative">
            <img 
              src="/tanit-logo.png" 
              alt="Tanit, diosa de la naturaleza" 
              className="w-full object-cover aspect-[4/3]"
            />
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
        onClick={() => onSelectCharacter("bess")}
        className={`relative overflow-hidden h-auto p-0 ${
          selectedCharacter === "bess"
            ? "border-2 border-white shadow-lg" 
            : "border border-white/20 hover:border-bess-primary/70"
        } rounded-lg transition-all duration-300`}
      >
        <div className="w-full h-full">
          <div className="relative">
            <img 
              src="/bess-logo.png" 
              alt="Bess, dios de la fiesta" 
              className="w-full object-cover aspect-[4/3]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bess-primary/90 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-left">
              <h3 className="font-bold text-2xl text-white">{t('characters.bess.name')}</h3>
              <p className="text-sm text-white/90 max-w-xs">{t('characters.bess.description')}</p>
              <div className="flex mt-2 gap-1">
                <Music className="h-5 w-5 text-white" />
                <Flame className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
        {selectedCharacter === "bess" && (
          <div className="absolute top-2 right-2 bg-white text-bess-primary text-xs px-2 py-1 rounded-full">
            {t('chat.active')}
          </div>
        )}
      </Button>
    </div>
  );
};
