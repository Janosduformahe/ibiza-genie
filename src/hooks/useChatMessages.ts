
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Character } from "@/types/character";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  character?: string;
}

export const useChatMessages = (character: Character) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      loadChatHistory();
    } else {
      setMessages([]);
    }
  }, [user, character]);

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
      } else {
        setMessages([]);
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

  const sendMessage = async (content: string) => {
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

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    loading,
    sendMessage,
    clearMessages
  };
};
