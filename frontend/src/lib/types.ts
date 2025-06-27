export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  strikeoutPrice?: number;
  images: string[];
  category: string;
  bestseller?: boolean;
  sizes?: string[];
  specifications?: string;
};

export type CartItem = {
  _id: string;
  productId: string;
  quantity: number;
  size: string;
};

export type Cart = {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
};

export type Address = {
  _id: string;
  fullAddress: string;
};

export type User = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    date: string;
    addresses: Address[];
};

export type Review = {
  _id: string;
  productId: string;
  name: string;
  email: string;
  rating: number;
  title: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
};
