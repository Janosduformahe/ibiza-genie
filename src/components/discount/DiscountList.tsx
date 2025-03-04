
import React from 'react';
import { DiscountCard, DiscountOffer } from './DiscountCard';

interface DiscountListProps {
  discounts: DiscountOffer[];
  isLoading?: boolean;
}

export const DiscountList: React.FC<DiscountListProps> = ({ discounts, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[300px] rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {discounts.map((discount) => (
        <DiscountCard key={discount.id} discount={discount} />
      ))}
    </div>
  );
};
