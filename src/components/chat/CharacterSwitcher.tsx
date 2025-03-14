
import { Sun, Palmtree, Waves, Leaf, Music, Flame, Sparkles, PartyPopper } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Character, characterDetails } from "@/types/character";
import { useState } from "react";

interface CharacterSwitcherProps {
  selectedCharacter: Character;
  onChangeCharacter?: (character: Character) => void;
}

export const CharacterSwitcher = ({ selectedCharacter, onChangeCharacter }: CharacterSwitcherProps) => {
  const [showDescription, setShowDescription] = useState(false);
  const [descriptionCharacter, setDescriptionCharacter] = useState<Character | null>(null);
  
  const handleCharacterChange = (character: Character) => {
    if (onChangeCharacter) {
      setDescriptionCharacter(character);
      setShowDescription(true);
      
      // Show description for 3 seconds before changing character
      setTimeout(() => {
        onChangeCharacter(character);
        setShowDescription(false);
      }, 3000);
    }
  };
  
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
  
  if (!onChangeCharacter) return null;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/20 mr-2"
        >
          Cambiar a {selectedCharacter === "tanit" ? "Dionisio" : "Tanit"}
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
              handleCharacterChange("tanit");
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
              selectedCharacter === "dionisio" 
                ? "border-dionisio-primary bg-dionisio-primary/20" 
                : "border-white/20 hover:border-dionisio-primary/70"
            }`}
            onClick={() => {
              handleCharacterChange("dionisio");
            }}
          >
            <div className="aspect-square rounded-md overflow-hidden mb-2 bg-dionisio-primary/20 flex justify-center items-center">
              <img 
                src={characterDetails.dionisio.avatar} 
                alt="Dionisio, dios de la fiesta" 
                className="w-3/4 h-3/4 object-contain"
              />
            </div>
            <h3 className="font-bold text-lg text-dionisio-primary">Dionisio</h3>
            <p className="text-sm text-gray-600">Dios griego de la fiesta, amante del hedonismo y la vida nocturna.</p>
            <div className="flex mt-2">
              {characterDetails.dionisio.icons.map((icon, i) => renderIcon(icon, i))}
            </div>
          </div>
        </div>
        
        {showDescription && descriptionCharacter && (
          <div className={`mt-4 p-4 rounded-lg text-white text-center animate-pulse ${
            descriptionCharacter === "tanit" 
              ? "bg-gradient-to-r from-teal-500 to-blue-600" 
              : "bg-gradient-to-r from-pink-500 to-purple-600"
          }`}>
            <p className="font-medium text-lg">
              {descriptionCharacter === "dionisio" 
                ? "¡Preparando las mejores fiestas para ti! 🎉" 
                : "¡Conectando con la naturaleza de Ibiza! 🌊"}
            </p>
            <p>{characterDetails[descriptionCharacter].briefDescription}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
