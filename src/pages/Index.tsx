import { ChatInterface } from "@/components/ChatInterface";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag, BookOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Hero Text */}
          <div className="space-y-6 text-white order-2 lg:order-1">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Your AI Guide to Ibiza's Best Experiences
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Get instant recommendations for parties, clubs, and events from our AI-powered assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" 
                className="bg-white text-[#8B5CF6] hover:bg-white/90 transition-all">
                <Link to="/shop">Visit Shop</Link>
              </Button>
              <Button asChild size="lg" variant="outline" 
                className="border-white text-white hover:bg-white/10">
                <Link to="/blog">Read Blog</Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Chat Interface */}
          <div className="order-1 lg:order-2">
            <ChatInterface />
          </div>
        </div>

        {/* Features Section with new design */}
        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20">
            <ShoppingBag className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Exclusive Merch</h3>
            <p className="text-white/80">
              Shop our curated collection of Ibiza-inspired merchandise
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20">
            <BookOpen className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Insider Blog</h3>
            <p className="text-white/80">
              Read expert tips and stories about the island's best experiences
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Updates</h3>
            <p className="text-white/80">
              Stay informed about the latest events and party announcements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;