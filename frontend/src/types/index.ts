export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  OPERATOR = 'OPERATOR',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  category?: Category;
  unit: string;
  currentQuantity: number;
  minQuantity: number;
  unitPrice?: number;
  sku?: string;
  expirationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export enum MovementType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
}

export interface Movement {
  id: number;
  productId: number;
  product?: Product;
  userId: number;
  user?: User;
  type: MovementType;
  quantity: number;
  reason?: string;
  supplier?: string;
  invoiceNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface Alert {
  id: number;
  productId: number;
  productName: string;
  categoryName: string;
  currentQuantity: number;
  minQuantity: number;
  unit: string;
  level: 'CRITICAL' | 'WARNING';
}

export interface DashboardStats {
  totalProducts: number;
  alertsCount: number;
  criticalAlertsCount: number;
  totalStockValue: number;
  last30Days: {
    totalEntries: number;
    totalExits: number;
    totalEntriesQuantity: number;
    totalExitsQuantity: number;
  };
}