// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Address types
export interface Address {
  id: string;
  userId: string;
  name?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  category: ProductCategory;
  images: ProductImage[];
  variants: ProductVariant[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  stock: number;
  attributes?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Review and Rating types
export interface Review {
  id: string;
  userId: string;
  user: User;
  productId: string;
  product: Product;
  rating: number; // 1-5
  title: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  taxAmount: number;
  discount: number;
  currency: string;
  paymentId?: string;
  shippingAddressId?: string;
  billingAddressId?: string;
  trackingNumber?: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

// Photo types
export interface Photo {
  id: string;
  userId: string;
  url: string;
  name?: string;
  size?: number;
  type?: string;
  albumId?: string;
  tags: PhotoTag[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Album {
  id: string;
  userId: string;
  name: string;
  isPublic: boolean;
  photos: Photo[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PhotoTag {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Design types
export interface Design {
  id: string;
  userId: string;
  name: string;
  description?: string;
  data: Record<string, any>;
  thumbnail?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Design element types for canvas
export interface CanvasElement {
  id: string;
  type: 'image' | 'text' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  [key: string]: any;
}

export interface CanvasPage {
  id: string;
  elements: CanvasElement[];
  background?: string;
  width: number;
  height: number;
}

export interface PhotoBookDesign {
  id: string;
  pages: CanvasPage[];
  title: string;
  cover?: CanvasPage;
  settings: {
    bookType: 'softcover' | 'hardcover' | 'layflat';
    size: 'A4' | 'A5' | 'square';
    pageCount: number;
    paperType: 'glossy' | 'matte' | 'premium';
  };
}