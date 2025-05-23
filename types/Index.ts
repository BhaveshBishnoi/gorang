// types/index.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  price: number;
  quantity: number;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  type: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  price: number;
  quantity: number;
}

export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface Order {
  id: string;
  status: OrderStatus;
  createdAt: string;
  total: number;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
}
