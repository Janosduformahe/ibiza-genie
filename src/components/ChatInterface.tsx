import { useState, useEffect, useRef } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessagesContainer } from "./MessagesContainer";
import { ChatInput } from "./ChatInput";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Character } from "@/types/character";
import { CharacterSelector } from "./CharacterSelector";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  character?: string;
}

interface ChatInterfaceProps {
  fullPage?: boolean;
  selectedCharacter?: Character;
  onChangeCharacter?: (character: Character) => void;
}

export const ChatInterface = ({ 
  fullPage, 
  selectedCharacter: externalCharacter,
  onChangeCharacter
}: ChatInterfaceProps = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [character, setCharacter] = useState<Character>(externalCharacter || "tanit");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    if (externalCharacter && externalCharacter !== character) {
      setCharacter(externalCharacter);
    }
  }, [externalCharacter]);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user, character]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", user.id)
        .eq("character", character)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading chat history:", error);
        return;
      }

      if (data && data.length > 0) {
        const formattedMessages: Message[] = data.map((msg) => ({
          id: msg.id,
          content: msg.content,
          isUser: msg.is_user,
          character: msg.character,
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const saveChatMessage = async (message: Message) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("chat_messages").insert({
        user_id: user.id,
        character: character,
        content: message.content,
        is_user: message.isUser,
      });

      if (error) {
        console.error("Error saving chat message:", error);
      }
    } catch (error) {
      console.error("Error saving chat message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      character,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (user) saveChatMessage(userMessage);
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_APP_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((msg) => ({
              role: msg.isUser ? "user" : "assistant",
              content: msg.content,
            })),
            { role: "user", content },
          ],
          character,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = {
        id: Date.now().toString() + "-bot",
        content: data.message,
        isUser: false,
        character,
      };

      setMessages((prev) => [...prev, botMessage]);
      if (user) saveChatMessage(botMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: t("chat.error"),
        description: t("chat.errorDescription"),
      });

      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        content: t("chat.errorMessage"),
        isUser: false,
        character,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleCharacterChange = (newCharacter: Character) => {
    setCharacter(newCharacter);
    setMessages([]);
    if (onChangeCharacter) {
      onChangeCharacter(newCharacter);
    }
  };

  return (
    <div className="relative h-full flex flex-col bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden rounded-lg shadow-lg border border-gray-800">
      <ChatHeader 
        selectedCharacter={character} 
        isExpanded={fullPage}
      />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <CharacterSelector 
          selectedCharacter={character} 
          onSelectCharacter={handleCharacterChange}
        />
        
        <MessagesContainer 
          messages={messages} 
          loading={loading}
          selectedCharacter={character}
          scrollRef={messagesEndRef}
        />
      </div>
      
      <div className="p-4 border-t border-gray-800 bg-gray-900 space-y-2">
        {!user && (
          <div className="text-center mb-4 p-2 bg-blue-900/40 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">{t("auth.signInToSaveChats")}</p>
            <div className="flex justify-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={() => window.location.href = '/auth'}
              >
                {t("auth.signIn")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={() => window.location.href = '/auth'}
              >
                {t("auth.signUp")}
              </Button>
            </div>
          </div>
        )}
        <ChatInput 
          onSendMessage={handleSendMessage} 
          onClearChat={handleClearChat} 
          disabled={loading}
          selectedCharacter={character}
        />
      </div>
    </div>
  );
};
