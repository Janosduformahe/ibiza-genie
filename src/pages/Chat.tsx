
import { ChatInterface } from "@/components/ChatInterface";
import { Navigation } from "@/components/Navigation";

const Chat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0EA5E9] via-[#33C3F0] to-[#0FA0CE]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Chat with Biza - Your AI Ibiza Guide
          </h1>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
            <ChatInterface fullPage={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
