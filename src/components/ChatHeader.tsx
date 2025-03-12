
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

  return (
    <div className={`flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r ${
      selectedCharacter === "tanit" 
        ? "from-tanit-primary to-tanit-secondary" 
        : "from-bess-primary to-bess-secondary"
    }`}>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/50">
          <img 
            src={characterInfo.avatar} 
            alt={`${characterInfo.name} avatar`} 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-lg font-semibold text-white">Chat con {characterInfo.name}</h2>
      </div>
      
      {isExpanded && (
        <>
          {onChangeCharacter && (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20 mr-2"
                >
                  Cambiar a {selectedCharacter === "tanit" ? "Bess" : "Tanit"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Elige tu guía de Ibiza</DialogTitle>
                  <DialogDescription>
                    Cada deidad te mostrará un lado diferente de la isla
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedCharacter === "tanit" 
                        ? "border-tanit-primary bg-tanit-primary/20" 
                        : "border-white/20 hover:border-tanit-primary/70"
                    }`}
                    onClick={() => {
                      onChangeCharacter("tanit");
                    }}
                  >
                    <div className="aspect-square rounded-md overflow-hidden mb-2 bg-tanit-primary/20 flex justify-center items-center">
                      <img 
                        src={characterDetails.tanit.avatar} 
                        alt="Tanit, diosa de la naturaleza" 
                        className="w-3/4 h-3/4 object-contain"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-tanit-primary">Tanit</h3>
                    <p className="text-sm text-gray-600">Diosa fenicia de Ibiza, amante de la naturaleza, el mar y el bienestar.</p>
                    <div className="flex mt-2">
                      {characterDetails.tanit.icons.map((icon, i) => renderIcon(icon, i))}
                    </div>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedCharacter === "bess" 
                        ? "border-bess-primary bg-bess-primary/20" 
                        : "border-white/20 hover:border-bess-primary/70"
                    }`}
                    onClick={() => {
                      onChangeCharacter("bess");
                    }}
                  >
                    <div className="aspect-square rounded-md overflow-hidden mb-2 bg-bess-primary/20 flex justify-center items-center">
                      <img 
                        src={characterDetails.bess.avatar} 
                        alt="Bess, dios de la fiesta" 
                        className="w-3/4 h-3/4 object-contain"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-bess-primary">Bess</h3>
                    <p className="text-sm text-gray-600">Dios egipcio de la música y la fiesta, amante del hedonismo y la vida nocturna.</p>
                    <div className="flex mt-2">
                      {characterDetails.bess.icons.map((icon, i) => renderIcon(icon, i))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
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
                <Input
                  placeholder="+34612345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Button onClick={onWhatsAppConnect}>
                  Conectar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};
