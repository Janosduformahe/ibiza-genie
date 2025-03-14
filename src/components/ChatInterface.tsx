
import { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const characterInfo = characterDetails[selectedCharacter];
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isExpanded, setIsExpanded] = useState(fullPage);
  const { toast } = useToast();

  // Load initial greeting or chat history
  useEffect(() => {
    if (user) {
      loadChatHistory(selectedCharacter);
    } else {
      // If not logged in, just show the greeting
      setMessages([{
        content: t(`characters.${selectedCharacter}.greeting`),
        isUser: false,
      }]);
    }
  }, [selectedCharacter, user]);
  
  // Load chat history from Supabase for logged-in users
  const loadChatHistory = async (character: Character) => {
    if (!user) return;
    
    try {
      setIsLoadingHistory(true);
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('character', character)
        .order('created_at', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const formattedMessages = data.map(msg => ({
          content: msg.content,
          isUser: msg.is_user
        }));
        setMessages(formattedMessages);
      } else {
        // If no history, just show the greeting
        setMessages([{
          content: t(`characters.${selectedCharacter}.greeting`),
          isUser: false,
        }]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setMessages([{
        content: t(`characters.${selectedCharacter}.greeting`),
        isUser: false,
      }]);
    } finally {
      setIsLoadingHistory(false);
    }
  };
  
  // Save message to database for logged-in users
  const saveMessage = async (content: string, isUser: boolean) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          character: selectedCharacter,
          content,
          is_user: isUser
        });
        
      if (error) {
        console.error('Error saving message:', error);
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!isExpanded && !fullPage) {
      setIsExpanded(true);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Add user message to state and save to DB if logged in
      setMessages((prev) => [...prev, { content, isUser: true }]);
      if (user) {
        await saveMessage(content, true);
      }

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

      const botResponse = data.response || t('chat.errorResponse', { name: characterInfo.name });
      
      // Add bot message to state and save to DB if logged in
      setMessages((prev) => [
        ...prev,
        {
          content: botResponse,
          isUser: false,
        },
      ]);
      
      if (user) {
        await saveMessage(botResponse, false);
      }
      
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
      
      if (user) {
        // For logged-in users, load their chat history with this character
        loadChatHistory(character);
      } else {
        // For non-logged-in users, just show the greeting
        setMessages([
          {
            content: t(`characters.${character}.greeting`),
            isUser: false,
          },
        ]);
      }
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
          onChangeCharacter={handleChangeCharacter}
        />
        <MessagesContainer 
          messages={messages}
          isLoading={isLoading || isLoadingHistory}
          isExpanded={isExpanded || fullPage}
          selectedCharacter={selectedCharacter}
        />
        <ChatInput 
          onSend={handleSendMessage} 
          disabled={isLoading || isLoadingHistory} 
          placeholder={isExpanded || fullPage ? t(`chat.askAbout${selectedCharacter === "tanit" ? "Nature" : "Parties"}`) : t('chat.clickToChat', { name: characterInfo.name })}
          selectedCharacter={selectedCharacter}
        />
        
        {!user && messages.length > 1 && !isLoading && (
          <div className="absolute bottom-20 left-0 right-0 p-2 z-10 backdrop-blur-sm bg-black/60 text-center">
            <p className="text-white text-sm mb-2">
              {t('chat.loginToSaveHistory')}
            </p>
            <Button 
              onClick={() => navigate('/auth')} 
              variant="outline" 
              size="sm" 
              className="text-white border-white/30 hover:bg-white/20"
            >
              {t('auth.signIn')}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
