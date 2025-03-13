
import { MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Character, characterDetails } from "@/types/character";

interface WhatsAppConnectorProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onWhatsAppConnect: () => void;
  selectedCharacter: Character;
}

export const WhatsAppConnector = ({ 
  phoneNumber, 
  setPhoneNumber, 
  onWhatsAppConnect, 
  selectedCharacter 
}: WhatsAppConnectorProps) => {
  const characterInfo = characterDetails[selectedCharacter];
  
  return (
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
  );
};
