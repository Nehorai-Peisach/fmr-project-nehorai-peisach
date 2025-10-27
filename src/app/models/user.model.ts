export interface User {
  id: number;
  name: string;
}

export interface UserDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  joinDate: string;
  lastLogin: string;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    theme: 'light' | 'dark';
  };
  statistics: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    favoriteCategory: string;
  };
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  category: string;
}
