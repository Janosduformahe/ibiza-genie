import { Sun, Palmtree, Waves, Sunset, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";

interface ChatHeaderProps {
  isExpanded: boolean;
  onClose: (e: React.MouseEvent) => void;
  onWhatsAppConnect: () => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}

export const ChatHeader = ({
  isExpanded,
  onClose,
  onWhatsAppConnect,
  phoneNumber,
  setPhoneNumber,
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-ibiza-azure to-ibiza-night">
      <div className="flex items-center space-x-2">
        <Sun className="h-6 w-6 text-white animate-pulse" />
        <Palmtree className="h-6 w-6 text-white animate-bounce" />
        <h2 className="text-lg font-semibold text-white">Chat with Biza</h2>
        <Waves className="h-6 w-6 text-white animate-pulse" />
        <Sunset className="h-6 w-6 text-white animate-bounce" />
      </div>
      {isExpanded && (
        <>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            onClick={onClose}
          >
            ✕
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect with WhatsApp</DialogTitle>
                <DialogDescription>
                  Get Biza's responses directly on WhatsApp! Enter your phone number with country code (e.g., +34612345678)
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="+34612345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Button onClick={onWhatsAppConnect}>
                  Connect
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};