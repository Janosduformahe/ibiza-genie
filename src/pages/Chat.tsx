
import { ChatInterface } from "@/components/ChatInterface";
import { Navigation } from "@/components/Navigation";

const Chat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A3D55] via-[#1D6A8B] to-[#0F86A9]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Chat with Biza - Your AI Ibiza Guide
          </h1>
          
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
            <ChatInterface fullPage={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
