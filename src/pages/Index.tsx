import { ChatInterface } from "@/components/ChatInterface";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ibiza-sand to-white">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block">
            <span className="px-4 py-1.5 bg-ibiza-azure text-white text-sm font-medium rounded-full">
              Your Personal Ibiza Guide
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ibiza-night">
            Welcome to Ibiza AI Concierge
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your intelligent companion for discovering the best of Ibiza. From exclusive parties to hidden gems, get personalized recommendations instantly.
          </p>
          <Link
            to="/blog"
            className="inline-block px-6 py-3 bg-ibiza-azure text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Read Our Blog
          </Link>
        </div>
        
        <ChatInterface />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          Powered by advanced AI technology. Updated with real-time party and event data.
        </div>
      </div>
    </div>
  );
};

export default Index;