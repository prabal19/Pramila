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