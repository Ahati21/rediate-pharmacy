export type UserRole = 'customer' | 'pharmacist' | 'admin';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  category: string;
  price: number;
  stock: number;
  batchNumber: string;
  expiryDate: string;
  status: 'Approved' | 'Low Stock' | 'Expiring' | 'Pending';
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

export interface CartItem {
  medication: Medication;
  quantity: number;
}
