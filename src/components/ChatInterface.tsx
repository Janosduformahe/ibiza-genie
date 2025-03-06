
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
  const characterInfo = characterDetails[selectedCharacter];
  
  const [messages, setMessages] = useState<Message[]>([
    {
      content: characterInfo.greeting,
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
          content: data.response || `Lo siento! ${characterInfo.name} está teniendo problemas para responder ahora mismo.`,
          isUser: false,
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppConnect = async () => {
    try {
      if (!phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
        throw new Error("Por favor ingresa un número de teléfono válido con código de país");
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
        title: "WhatsApp Conectado!",
        description: `Recibirás un mensaje de ${characterInfo.name} en WhatsApp pronto.`,
      });
    } catch (error) {
      console.error('WhatsApp error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al conectar WhatsApp. Por favor, intenta de nuevo.",
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

  return (
    <Card 
      className={cn(
        "chat-container glass-card transition-all duration-500 ease-in-out",
        fullPage ? "w-full h-[calc(100vh-200px)] min-h-[600px] !m-0" : 
          isExpanded ? "fixed inset-0 m-0 rounded-none z-50 min-h-screen" : "max-w-2xl mx-auto"
      )}
      onClick={() => !isExpanded && !fullPage && setIsExpanded(true)}
    >
      <div className="flex flex-col h-full">
        <ChatHeader 
          isExpanded={isExpanded || fullPage}
          onClose={handleClose}
          onWhatsAppConnect={handleWhatsAppConnect}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          showCloseButton={!fullPage || isExpanded}
          selectedCharacter={selectedCharacter}
          onChangeCharacter={onChangeCharacter}
        />
        <MessagesContainer 
          messages={messages}
          isLoading={isLoading}
          isExpanded={isExpanded || fullPage}
          selectedCharacter={selectedCharacter}
        />
        <ChatInput 
          onSend={handleSendMessage} 
          disabled={isLoading} 
          placeholder={isExpanded || fullPage ? `Pregunta a ${characterInfo.name} sobre ${selectedCharacter === "tanit" ? "playas, naturaleza o bienestar" : "fiestas, clubes o eventos"}...` : `Haz clic para chatear con ${characterInfo.name}...`}
          selectedCharacter={selectedCharacter}
        />
      </div>
    </Card>
  );
};
