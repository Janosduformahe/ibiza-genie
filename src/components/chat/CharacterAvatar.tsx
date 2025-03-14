
import { Character, characterDetails } from "@/types/character";

interface CharacterAvatarProps {
  selectedCharacter: Character;
}

export const CharacterAvatar = ({ selectedCharacter }: CharacterAvatarProps) => {
  const characterInfo = characterDetails[selectedCharacter];
  
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/50">
      <img 
        src={characterInfo.avatar} 
        alt={`${characterInfo.name} avatar`} 
        className="w-full h-full object-cover"
      />
    </div>
  );
};
