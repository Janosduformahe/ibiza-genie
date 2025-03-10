
import { ChatInterface } from "@/components/ChatInterface";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag, BookOpen, Tag, MessageSquare } from "lucide-react";
import { DiscountList } from "@/components/discount/DiscountList";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const { t } = useLanguage();
  
  // Datos de ejemplo para las tarjetas de descuento
  const discountOffers = [
    {
      id: "1",
      club: "Ushuaïa Ibiza",
      date: "Hoy",
      discountPercentage: 25,
      description: "Entrada general con descuento para la fiesta de David Guetta",
      code: "USHUAIA25",
      validUntil: "23:59 hoy"
    },
    {
      id: "2",
      club: "Amnesia Ibiza",
      date: "Hoy",
      discountPercentage: 30,
      description: "Skip the line y una bebida gratis con tu entrada",
      code: "AMNESIA30",
      validUntil: "21:00 hoy"
    },
    {
      id: "3",
      club: "Pacha Ibiza",
      date: "Mañana",
      discountPercentage: 20,
      description: "Descuento especial para la noche de house music",
      code: "PACHA20",
      validUntil: "20:00 mañana"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0EA5E9] via-[#33C3F0] to-[#0FA0CE]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Hero Text */}
          <div className="space-y-6 text-white order-2 lg:order-1">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {t('home.heroTitle')}
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" 
                className="bg-white text-[#0EA5E9] hover:bg-white/90 transition-all">
                <Link to="/chat">{t('home.chatButton')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" 
                className="border-white text-white hover:bg-white/10">
                <Link to="/calendar">{t('home.eventsButton')}</Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Chat Preview */}
          <div className="order-1 lg:order-2 relative">
            <div className="chat-preview-container relative">
              <div className="chat-preview-overlay absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 rounded-xl pointer-events-none z-10"></div>
              
              <ChatInterface />
              
              <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
                <Button asChild size="lg" className="bg-white text-[#0EA5E9] hover:bg-white/90">
                  <Link to="/chat" className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>{t('chat.clickToChat')}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Discount Cards Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <Tag className="mr-2 h-6 w-6" />
            {t('home.discountsTitle')}
            <span className="ml-2 text-sm bg-white text-[#0EA5E9] px-2 py-1 rounded-full">
              {t('home.spinToDiscover')}
            </span>
          </h2>
          <DiscountList discounts={discountOffers} />
        </div>

        {/* Features Section with new design */}
        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20">
            <ShoppingBag className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t('home.features.merch')}</h3>
            <p className="text-white/80">
              {t('home.features.merchDesc')}
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20">
            <BookOpen className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t('home.features.blog')}</h3>
            <p className="text-white/80">
              {t('home.features.blogDesc')}
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t('home.features.updates')}</h3>
            <p className="text-white/80">
              {t('home.features.updatesDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
