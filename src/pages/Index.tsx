import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag, BookOpen, Tag, MessageSquare } from "lucide-react";
import { DiscountList } from "@/components/discount/DiscountList";
import { useLanguage } from "@/hooks/useLanguage";
import { Character } from "@/types/character";
import { CharacterSelector } from "@/components/CharacterSelector";

const Index = () => {
  const { t } = useLanguage();
  const [selectedCharacter, setSelectedCharacter] = useState<Character>("tanit");
  
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
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero section with centered chat */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('home.heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            {t('home.heroSubtitle')}
          </p>
        </div>

        {/* Character Selector */}
        <div className="max-w-3xl mx-auto mb-8">
          <CharacterSelector 
            selectedCharacter={selectedCharacter}
            onSelectCharacter={setSelectedCharacter}
          />
        </div>

        {/* Centered Chat Interface */}
        <div className="max-w-3xl mx-auto mb-16">
          <ChatInterface 
            selectedCharacter={selectedCharacter}
            onChangeCharacter={setSelectedCharacter}
          />
        </div>

        {/* Discount Cards Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center justify-center">
            <Tag className="mr-2 h-6 w-6" />
            {t('home.discountsTitle')}
            <span className="ml-2 text-sm bg-white text-black px-2 py-1 rounded-full">
              {t('home.spinToDiscover')}
            </span>
          </h2>
          <DiscountList discounts={discountOffers} />
        </div>

        {/* Features Section */}
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
