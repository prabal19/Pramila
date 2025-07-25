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
  washInstructions?: string;
  createdAt: string;
  quantity: number;
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
    createdAt: string;
    updatedAt: string;
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
  returnStatus: ReturnStatus | null;
};

export type OrderStatus = 'Pending' | 'Confirmed / Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';

export type Order = {
  _id: string;
  userId: string | PopulatedUser; 
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
    phone: string;
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


export type RequestStatus = 'Open' | 'Pending' | 'Closed' | 'New Subscriber';
export type RequestType = 'Support' | 'Contact' | 'Newsletter';

export type Request = {
  _id: string;
  ticketId: number;
  type: RequestType;
  status: RequestStatus;
  
  contactName?: string;
  contactEmail: string;
  message?: string; // For Contact Form
  
  userId?: string | PopulatedUser; // Can be populated for Support
  subject?: string; // For Support/Contact
  category?: string; // For Support
  orderId?: string; // For Support
  messages: SupportMessage[]; // For Support

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


export type ReturnStatus = 'Pending Approval' | 'Approved' | 'Rejected' | 'Item Picked Up' | 'Refunded';

export type ReturnedProductInfo = {
  _id: string;
  productId: string;
  name: string;
  images: string[];
}

export type ReturnRequest = {
  _id: string;
  returnId: number;
  userId: string | PopulatedUser;
  orderId: string | { _id: string; totalAmount: number };
  orderItemId: string;
  product: ReturnedProductInfo;
  reason: string;
  description?: string;
  status: ReturnStatus;
  createdAt: string;
  updatedAt: string;
};