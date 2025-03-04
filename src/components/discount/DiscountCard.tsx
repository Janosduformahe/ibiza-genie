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
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div 
          className={`absolute w-full h-full backface-hidden rounded-xl overflow-hidden
            ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <Card className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0EA5E9] via-[#33C3F0] to-[#0FA0CE] text-white">
            <div className="text-5xl mb-4 opacity-90">
              <Percent />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-center">{discount.club}</h3>
            <p className="text-white/80 text-center mb-4">¡Gira la tarjeta para ver tu descuento especial!</p>
            <div className="mt-auto flex items-center gap-2 text-white/70">
              <Calendar className="h-4 w-4" />
              <span>Válido: {discount.date}</span>
            </div>
          </Card>
        </div>

        {/* Back of card */}
        <div 
          className={`absolute w-full h-full backface-hidden rounded-xl overflow-hidden
            ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Card className="w-full h-full flex flex-col p-6 bg-white text-black">
            <div className="mb-3 flex justify-between items-start">
              <h3 className="text-xl font-bold">{discount.club}</h3>
              <div className="text-lg font-bold text-[#0EA5E9]">{discount.discountPercentage}% OFF</div>
            </div>
            
            <p className="text-gray-600 mb-4">{discount.description}</p>
            
            <div className="mt-2 mb-4">
              <div className="text-sm text-gray-500 mb-1">Código de descuento:</div>
              <div className="p-3 bg-gray-100 rounded-lg text-center font-mono font-bold tracking-wider">
                {discount.code}
              </div>
            </div>
            
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
