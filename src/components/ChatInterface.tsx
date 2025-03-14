import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { MessagesContainer } from "./MessagesContainer";
import { useNavigate } from "react-router-dom";
import { Character, characterDetails } from "@/types/character";
import { useLanguage } from "@/hooks/useLanguage";

interface Message {
  content: string;
  isUser: boolean;
}

interface ChatInterfaceProps {
  fullPage?: boolean;
  selectedCharacter?: Character;
  onChangeCharacter?: (character: Character) => void;
}

export const ChatInterface = ({ 
  fullPage = false, 
  selectedCharacter = "tanit",
  onChangeCharacter
}: ChatInterfaceProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const characterInfo = characterDetails[selectedCharacter];
  
  const [messages, setMessages] = useState<Message[]>([
    {
      content: t(`characters.${selectedCharacter}.greeting`),
      isUser: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isExpanded, setIsExpanded] = useState(fullPage);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    if (!isExpanded && !fullPage) {
      setIsExpanded(true);
      return;
    }
    
    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { content, isUser: true }]);

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          message: content,
          character: selectedCharacter
        }
      });

      if (error) {
        console.error('Chat function error:', error);
        throw error;
      }

      setMessages((prev) => [
        ...prev,
        {
          content: data.response || t('chat.errorResponse', { name: characterInfo.name }),
          isUser: false,
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: t('chat.error'),
        description: t('chat.errorMessage'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppConnect = async () => {
    try {
      if (!phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
        throw new Error(t('chat.invalidPhone'));
      }

      const { data, error } = await supabase.functions.invoke('whatsapp', {
        body: { 
          message: {
            phoneNumber: phoneNumber,
            character: selectedCharacter
          }
        }
      });

      if (error) throw error;

      toast({
        title: t('chat.whatsappSuccess'),
        description: t('chat.whatsappMessage', { name: characterInfo.name }),
      });
    } catch (error) {
      console.error('WhatsApp error:', error);
      toast({
        title: t('chat.error'),
        description: error.message || t('chat.whatsappError'),
        variant: "destructive",
      });
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fullPage) {
      navigate('/');
    } else {
      setIsExpanded(false);
    }
  };

  const handleChangeCharacter = (character: Character) => {
    if (onChangeCharacter) {
      onChangeCharacter(character);
      
      // Reset messages with the new character's greeting
      setMessages([
        {
          content: t(`characters.${character}.greeting`),
          isUser: false,
        },
      ]);
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-[#1E1E1E]",
        fullPage ? "w-full" : "rounded-xl overflow-hidden"
      )}
    >
      <ChatHeader 
        isExpanded={isExpanded || fullPage}
        onClose={handleClose}
        onWhatsAppConnect={handleWhatsAppConnect}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        showCloseButton={!fullPage || isExpanded}
        selectedCharacter={selectedCharacter}
        onChangeCharacter={handleChangeCharacter}
      />
      
      <div className="flex-1 overflow-hidden relative">
        <MessagesContainer 
          messages={messages}
          isLoading={isLoading}
          isExpanded={isExpanded || fullPage}
          selectedCharacter={selectedCharacter}
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1E1E1E] to-transparent h-32 pointer-events-none" />
        
        <ChatInput 
          onSend={handleSendMessage} 
          disabled={isLoading} 
          placeholder={isExpanded || fullPage ? t(`chat.askAbout${selectedCharacter === "tanit" ? "Nature" : "Parties"}`) : t('chat.clickToChat', { name: characterInfo.name })}
          selectedCharacter={selectedCharacter}
        />
      </div>
    </div>
  );
};
