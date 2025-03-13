
import { Button } from "./ui/button";
import { Character, characterDetails } from "@/types/character";
import { CharacterAvatar } from "./chat/CharacterAvatar";
import { CharacterSwitcher } from "./chat/CharacterSwitcher";
import { WhatsAppConnector } from "./chat/WhatsAppConnector";

interface ChatHeaderProps {
  isExpanded: boolean;
  onClose: (e: React.MouseEvent) => void;
  onWhatsAppConnect: () => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  showCloseButton?: boolean;
  selectedCharacter: Character;
  onChangeCharacter?: (character: Character) => void;
}

export const ChatHeader = ({
  isExpanded,
  onClose,
  onWhatsAppConnect,
  phoneNumber,
  setPhoneNumber,
  showCloseButton = true,
  selectedCharacter,
  onChangeCharacter
}: ChatHeaderProps) => {
  const characterInfo = characterDetails[selectedCharacter];

  return (
    <div className={`flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r ${
      selectedCharacter === "tanit" 
        ? "from-tanit-primary to-tanit-secondary" 
        : "from-dionisio-primary to-dionisio-secondary"
    }`}>
      <div className="flex items-center space-x-3">
        <CharacterAvatar selectedCharacter={selectedCharacter} />
        <h2 className="text-lg font-semibold text-white">Chat con {characterInfo.name}</h2>
      </div>
      
      {isExpanded && (
        <>
          <CharacterSwitcher 
            selectedCharacter={selectedCharacter} 
            onChangeCharacter={onChangeCharacter} 
          />
          
          {showCloseButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              onClick={onClose}
            >
              ✕
            </Button>
          )}
          
          <WhatsAppConnector 
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onWhatsAppConnect={onWhatsAppConnect}
            selectedCharacter={selectedCharacter}
          />
        </>
      )}
    </div>
  );
};
