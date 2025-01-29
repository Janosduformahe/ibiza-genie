import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/components/ui/use-toast";
import { Product, ProductVariant } from "@/types/product";
import { ProductList } from "@/components/shop/ProductList";

const Shop = () => {
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading products",
          description: error.message,
        });
        return [];
      }

      // Parse the variants JSON field into ProductVariant[]
      return data.map((product) => ({
        ...product,
        variants: Array.isArray(product.variants)
          ? product.variants.map((variant: any): ProductVariant => ({
              type: variant.type || "",
              options: Array.isArray(variant.options) ? variant.options : [],
            }))
          : [],
      })) as Product[];
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-ibiza-sand to-white">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-ibiza-night mb-8">
          Ibiza Collection
        </h1>
        <ProductList products={products || []} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Shop;