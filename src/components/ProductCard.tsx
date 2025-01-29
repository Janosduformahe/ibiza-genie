import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  variants: Array<{
    type: string;
    options: string[];
  }>;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { productId: product.id }
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Failed to initiate checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {product.image_url && (
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        <p className="text-gray-600">{product.description}</p>
        <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Buy Now'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};