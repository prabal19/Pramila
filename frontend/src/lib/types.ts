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
  createdAt: string;
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

export type PopulatedUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  _id: string;
};

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type Order = {
  _id: string;
  userId: PopulatedUser;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type Banner = {
  _id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  position:  'above-header' |'top-of-page' | 'after-section' | 'bottom-of-page';
  targetPages: string[];
  sectionIdentifier?: string;
  order?: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  animation?: 'none' | 'fade' | 'slide' | 'zoom';
  clickableImage?: boolean;
  createdAt: string;
  updatedAt: string;
};