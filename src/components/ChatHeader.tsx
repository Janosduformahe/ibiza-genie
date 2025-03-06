import { Sun, Palmtree, Waves, Leaf, Music, Flame, Sparkles, PartyPopper, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Character, characterDetails } from "@/types/character";
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
  const renderIcon = (iconName: string, index: number) => {
    const icons = {
      sun: <Sun key={index} className="h-6 w-6 text-white animate-pulse" />,
      palmtree: <Palmtree key={index} className="h-6 w-6 text-white animate-bounce" />,
      waves: <Waves key={index} className="h-6 w-6 text-white animate-pulse" />,
      leaf: <Leaf key={index} className="h-6 w-6 text-white animate-bounce" />,
      music: <Music key={index} className="h-6 w-6 text-white animate-pulse" />,
      flame: <Flame key={index} className="h-6 w-6 text-white animate-bounce" />,
      sparkles: <Sparkles key={index} className="h-6 w-6 text-white animate-pulse" />,
      "party-popper": <PartyPopper key={index} className="h-6 w-6 text-white animate-bounce" />
    };
    return icons[iconName] || <Sun key={index} className="h-6 w-6 text-white" />;
  };
  return <div className={`flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r ${selectedCharacter === "tanit" ? "from-tanit-primary to-tanit-secondary" : "from-bess-primary to-bess-secondary"}`}>
      <div className="flex items-center space-x-2">
        {characterInfo.icons.map((icon, index) => renderIcon(icon, index))}
        <h2 className="text-lg font-semibold text-white">Chat con {characterInfo.name}</h2>
      </div>
      
      {isExpanded && <>
          {onChangeCharacter}
          
          {showCloseButton && <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onClose}>
              ✕
            </Button>}
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Conectar con WhatsApp</DialogTitle>
                <DialogDescription>
                  ¡Recibe las respuestas de {characterInfo.name} directamente en WhatsApp! Ingresa tu número con código de país (ej., +34612345678)
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <Input placeholder="+34612345678" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                <Button onClick={onWhatsAppConnect}>
                  Conectar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>}
    </div>;
};