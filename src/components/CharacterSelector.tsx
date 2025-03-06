
import React from "react";
import { Sun, Palmtree, Music, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Character } from "@/types/character";

interface CharacterSelectorProps {
  selectedCharacter: Character;
  onSelectCharacter: (character: Character) => void;
}

export const CharacterSelector = ({ selectedCharacter, onSelectCharacter }: CharacterSelectorProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
      <Button
        onClick={() => onSelectCharacter("tanit")}
        className={`relative flex-1 px-6 py-8 ${
          selectedCharacter === "tanit"
            ? "bg-gradient-to-r from-tanit-secondary to-tanit-primary text-white border-2 border-white"
            : "bg-white/20 text-white hover:bg-tanit-secondary/70"
        } rounded-lg transition-all duration-300`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Sun className="h-6 w-6" />
            <Palmtree className="h-6 w-6" />
          </div>
          <div className="text-xl font-bold">Tanit</div>
          <div className="text-sm opacity-80">Naturaleza, mar y bienestar</div>
        </div>
        {selectedCharacter === "tanit" && (
          <div className="absolute top-2 right-2 bg-white text-tanit-primary text-xs px-2 py-1 rounded-full">
            Activo
          </div>
        )}
      </Button>

      <Button
        onClick={() => onSelectCharacter("bess")}
        className={`relative flex-1 px-6 py-8 ${
          selectedCharacter === "bess"
            ? "bg-gradient-to-r from-bess-primary to-bess-secondary text-white border-2 border-bess-accent"
            : "bg-white/20 text-white hover:bg-bess-primary/70"
        } rounded-lg transition-all duration-300`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6" />
            <Flame className="h-6 w-6" />
          </div>
          <div className="text-xl font-bold">Bess</div>
          <div className="text-sm opacity-80">Fiesta y hedonismo</div>
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
