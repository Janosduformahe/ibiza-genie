
import { ChatInterface } from "@/components/ChatInterface";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { useState } from "react";
import { Character } from "@/types/character";
import { Button } from "@/components/ui/button";
import { Search, Mic, Sparkles } from "lucide-react";

const Index = () => {
  const { t } = useLanguage();
  const [selectedCharacter, setSelectedCharacter] = useState<Character>("tanit");
  const [inputValue, setInputValue] = useState("");
  
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navigation />
      
      <div className="flex-1 flex flex-col items-center justify-between px-4 pb-8 pt-4 max-w-3xl mx-auto w-full">
        <div className="w-full max-w-3xl mx-auto mt-16 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white text-center mb-8">
            {t('home.whatCanIHelpWith')}
          </h1>
          
          <div className="chat-preview-container w-full">
            <ChatInterface 
              fullPage={true}
              selectedCharacter={selectedCharacter}
              onChangeCharacter={setSelectedCharacter}
            />
          </div>
        </div>
        
        <div className="w-full max-w-3xl mx-auto mt-8">
          <div className="flex flex-wrap justify-center gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-gray-800/80 border-gray-700 text-white hover:bg-gray-700"
            >
              <Search className="h-4 w-4" />
              {t('home.searchWithAI')}
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-gray-800/80 border-gray-700 text-white hover:bg-gray-700"
            >
              <Mic className="h-4 w-4" />
              {t('home.talkWithAI')}
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-gray-800/80 border-gray-700 text-white hover:bg-gray-700"
            >
              <Sparkles className="h-4 w-4" />
              {t('home.more')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
