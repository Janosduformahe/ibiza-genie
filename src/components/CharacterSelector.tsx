import React from "react";
import { Sun, Palmtree, Music, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Character, characterDetails } from "@/types/character";
import { useLanguage } from "@/hooks/useLanguage";
interface CharacterSelectorProps {
  selectedCharacter: Character;
  onSelectCharacter: (character: Character) => void;
}
export const CharacterSelector = ({
  selectedCharacter,
  onSelectCharacter
}: CharacterSelectorProps) => {
  const {
    t
  } = useLanguage();
  const handleCharacterChange = (character: Character) => {
    if (character !== selectedCharacter) {
      onSelectCharacter(character);
    }
  };
  return;
};