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
  size: string;
  _id: string;
};

export type OrderStatus = 'Pending' | 'Confirmed / Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';

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

export type PaymentMethod = {
  _id: string;
  userId: string;
  email: string;
  methodType: 'card';
  cardLast4: string;
  cardBrand: string;
  cardExpiry: string;
};

export type SupportMessage = {
  _id: string;
  sender: 'user' | 'support';
  senderName: string;
  message: string;
  timestamp: string;
};

export type SupportTicketStatus = 'Open' | 'Pending' | 'Closed';

export type SupportTicket = {
  _id: string;
  ticketId: number;
  userId: string | PopulatedUser; // Can be populated
  subject: string;
  category: string;
  orderId?: string;
  status: SupportTicketStatus;
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  _id: string;
  name: string;
  slug: string;
  parent: 'collection' | 'accessory';
  createdAt: string;
  updatedAt: string;
};