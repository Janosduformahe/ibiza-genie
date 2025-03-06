
import React from "react";
import { Sun, Palmtree, Music, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Character, characterDetails } from "@/types/character";

interface CharacterSelectorProps {
  selectedCharacter: Character;
  onSelectCharacter: (character: Character) => void;
}

export const CharacterSelector = ({ selectedCharacter, onSelectCharacter }: CharacterSelectorProps) => {
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
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800" 
              alt="Tanit, diosa de la naturaleza" 
              className="w-full object-cover aspect-[4/3]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-tanit-primary/90 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-left">
              <h3 className="font-bold text-2xl text-white">Tanit</h3>
              <p className="text-sm text-white/90 max-w-xs">Diosa fenicia de Ibiza, amante de la naturaleza, el mar y el bienestar.</p>
              <div className="flex mt-2 gap-1">
                <Sun className="h-5 w-5 text-white" />
                <Palmtree className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
        {selectedCharacter === "tanit" && (
          <div className="absolute top-2 right-2 bg-white text-tanit-primary text-xs px-2 py-1 rounded-full">
            Activo
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
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800" 
              alt="Bess, dios de la fiesta" 
              className="w-full object-cover aspect-[4/3]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bess-primary/90 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-left">
              <h3 className="font-bold text-2xl text-white">Bess</h3>
              <p className="text-sm text-white/90 max-w-xs">Dios egipcio de la música y la fiesta, amante del hedonismo y la vida nocturna.</p>
              <div className="flex mt-2 gap-1">
                <Music className="h-5 w-5 text-white" />
                <Flame className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
        {selectedCharacter === "bess" && (
          <div className="absolute top-2 right-2 bg-white text-bess-primary text-xs px-2 py-1 rounded-full">
            Activo
          </div>
        )}
      </Button>
    </div>
  );
};
