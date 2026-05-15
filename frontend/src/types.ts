export type UserRole = 'customer' | 'pharmacist' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  token?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  category: string;
  price: number;
  stock: number;
  batchNumber: string;
  expiryDate: string;
  notes?: string;
  status: 'Approved' | 'Low Stock' | 'Expiring' | 'Expired' | 'Pending';
  type: 'pill' | 'medication_liquid' | 'vaccines';
}

export interface Pharmacist {
  id: string;
  name: string;
  role: string;
  employeeId: string;
  email: string;
  phone: string;
  status: 'Approved' | 'Pending' | 'Inactive';
  avatar: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  paymentMethod?: string;
  transactionRef?: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'verified' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export interface DashboardStats {
  inventory: {
    total: number;
    lowStock: number;
    expiring: number;
    expired: number;
  };
  orders: {
    total: number;
    pending: number;
    delivered: number;
    recent: Order[];
  };
  revenue: {
    total: number;
  };
  pharmacists: {
    total: number;
  };
}
export interface Prescription {
  id: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  notes?: string;
  fileName?: string;
  fileUrl?: string;
  fileMimeType?: string;
  fileSize?: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  pharmacistNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}
export interface SalesReportData {
  totalSales: number;
  netProfit: number;
  averageOrderValue: number;
  totalOrders: number;
  period: 'daily' | 'weekly' | 'monthly';
  changes: {
    sales: number;
    profit: number;
    avgValue: number;
  };
  range: {
    start: string;
    end: string;
  };
  topMedications: Array<{
    name: string;
    category: string;
    volume: number;
    revenue: number;
    profit: number;
    currentStock: number;
    icon: string;
  }>;
  salesTrend: Array<{
    label: string;
    actual: number;
    projected: number;
  }>;
}
