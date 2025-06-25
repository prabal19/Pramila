export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  bestseller?: boolean;
};

export type CartItem = {
  id: string;
  quantity: number;
};
