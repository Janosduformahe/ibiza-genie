export interface ProductVariant {
  type: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  variants: ProductVariant[];
  created_at: string | null;
  updated_at: string | null;
}