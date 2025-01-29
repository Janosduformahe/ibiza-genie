import { ChatInterface } from "@/components/ChatInterface";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mountain, ShoppingBag, BookOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ibiza-sand to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto py-20 px-4">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-ibiza-night leading-tight">
            Your Ultimate Ibiza Experience Guide
          </h1>
          <p className="text-xl text-gray-600">
            Discover the magic of Ibiza with our AI-powered guide, exclusive merchandise, and insider tips.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-ibiza-azure hover:bg-ibiza-azure/90">
              <a href="#chat">Start Exploring</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/shop">Visit Shop</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-20 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <Mountain className="w-12 h-12 mx-auto text-ibiza-azure" />
            <h3 className="text-xl font-semibold">AI Travel Guide</h3>
            <p className="text-gray-600">
              Get personalized recommendations and answers about Ibiza instantly
            </p>
          </div>
          <div className="text-center space-y-4">
            <ShoppingBag className="w-12 h-12 mx-auto text-ibiza-azure" />
            <h3 className="text-xl font-semibold">Exclusive Merch</h3>
            <p className="text-gray-600">
              Shop our curated collection of Ibiza-inspired merchandise
            </p>
          </div>
          <div className="text-center space-y-4">
            <BookOpen className="w-12 h-12 mx-auto text-ibiza-azure" />
            <h3 className="text-xl font-semibold">Insider Blog</h3>
            <p className="text-gray-600">
              Read expert tips and stories about the island's best experiences
            </p>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section id="chat" className="container mx-auto py-12 px-4">
        <ChatInterface />
      </section>
      
      {/* SEO Footer */}
      <footer className="container mx-auto py-12 px-4 text-center text-sm text-gray-500">
        <p>
          Discover Ibiza with our AI-powered guide. Get personalized recommendations for clubs, 
          beaches, restaurants, and events. Shop exclusive merchandise and read insider tips on 
          our blog. Your ultimate companion for experiencing the magic of Ibiza.
        </p>
      </footer>
    </div>
  );
};

export default Index;