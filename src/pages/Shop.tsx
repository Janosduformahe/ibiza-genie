import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ShoppingBag } from "lucide-react";
import { Product, ProductVariant } from "@/types/product";

const Shop = () => {
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
        throw error;
      }
      
      // Parse the variants JSON field into ProductVariant[]
      return data.map(product => ({
        ...product,
        variants: Array.isArray(product.variants) 
          ? product.variants.map((variant: any): ProductVariant => ({
              type: variant.type || '',
              options: Array.isArray(variant.options) ? variant.options : []
            }))
          : []
      })) as Product[];
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-ibiza-sand/50 to-white">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <ShoppingBag className="w-12 h-12 mx-auto text-ibiza-azure mb-4" />
          <h1 className="text-4xl font-bold text-ibiza-night mb-4">Ibiza Shop</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our exclusive collection of Ibiza-inspired merchandise, from beachwear to accessories
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-ibiza-azure" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;