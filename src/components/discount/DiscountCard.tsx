
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { PartyPopper, Ticket, Calendar, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

export interface DiscountOffer {
  id: string;
  club: string;
  date: string;
  discountPercentage: number;
  description: string;
  code: string;
  validUntil: string;
}

interface DiscountCardProps {
  discount: DiscountOffer;
}

export const DiscountCard: React.FC<DiscountCardProps> = ({ discount }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Generate random gradient for each card to make them more colorful
  const getRandomGradient = () => {
    const gradients = [
      "from-[#F97316] to-[#FBBF24]", // Orange to Yellow
      "from-[#8B5CF6] to-[#D946EF]", // Purple to Pink
      "from-[#EC4899] to-[#F472B6]", // Pink to Light Pink
      "from-[#06B6D4] to-[#0EA5E9]", // Cyan to Blue
      "from-[#10B981] to-[#34D399]", // Emerald to Green
      "from-[#F43F5E] to-[#FB7185]", // Rose to Light Rose
    ];
    return gradients[Math.floor(Math.random() % gradients.length)];
  };

  return (
    <div 
      className="w-full perspective-1000 cursor-pointer h-[300px]" 
      onClick={handleFlip}
    >
      <motion.div 
        className="relative w-full h-full transition-all duration-500"
        initial={false}
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
          scale: isFlipped ? 1.05 : 1, // Add scaling effect on flip
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        whileHover={{ scale: isFlipped ? 1.05 : 1.03 }} // Hover effect
      >
        {/* Front of card */}
        <div 
          className={`absolute w-full h-full backface-hidden rounded-xl overflow-hidden
            ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <Card className={`w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br ${getRandomGradient()} text-white shadow-xl`}>
            <motion.div 
              className="text-5xl mb-4 opacity-90"
              animate={{ rotate: isFlipped ? 0 : [0, -10, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
            >
              <PartyPopper />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2 text-center">{discount.club}</h3>
            <p className="text-white/90 text-center mb-4 font-medium">¡Toca para descubrir un descuento exclusivo de fiesta! 🎉</p>
            <motion.div 
              className="mt-auto flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="h-4 w-4" />
              <span>Hoy: {discount.date}</span>
            </motion.div>
          </Card>
        </div>

        {/* Back of card */}
        <div 
          className={`absolute w-full h-full backface-hidden rounded-xl overflow-hidden
            ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Card className="w-full h-full flex flex-col p-6 bg-white text-black shadow-xl">
            <div className="mb-3 flex justify-between items-start">
              <h3 className="text-xl font-bold">{discount.club}</h3>
              <div className="text-lg font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white px-3 py-1 rounded-full">
                {discount.discountPercentage}% OFF
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{discount.description}</p>
            
            <motion.div 
              className="mt-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="text-sm text-gray-500 mb-1">Código de descuento:</div>
              <div className="p-3 bg-gray-100 rounded-lg text-center font-mono font-bold tracking-wider border-2 border-dashed border-purple-300">
                {discount.code}
              </div>
            </motion.div>
            
            <div className="mt-auto space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Fecha: {discount.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                <span>Válido hasta: {discount.validUntil}</span>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};
