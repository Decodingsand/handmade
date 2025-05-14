
export interface Seller {
  id: string;
  name: string;
  photo: string;
  location: string;
  style: string;
  bio: string;
  story?: string;
  studioImages?: string[];
  products: string[];
  featured?: boolean;
}

export interface Buyer {
  id: string;
  name: string;
  location: string;
  favorites: string[];
  avatar: string;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  tags: string[];
  featured: boolean;
  inventory: number;
}

export interface CartItem {
  productId: string;
  sellerId: string;
  quantity: number;
  price: number;
  title: string;
  image: string;
}

export interface Cart {
  buyerId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface Message {
  id: string;
  buyerId: string;
  sellerId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  items: CartItem[];
  total: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'cancelled';
}
