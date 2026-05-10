import { Medication, Pharmacist } from './types';

export const MOCK_MEDICATIONS: Medication[] = [
  {
    id: '1',
    name: 'Amoxicillin',
    dosage: '500mg',
    category: 'Antibiotics',
    price: 345.00,
    stock: 1250,
    batchNumber: '#AX-2024-001',
    expiryDate: '2025-12-01',
    status: 'Approved',
    type: 'pill'
  },
  {
    id: '2',
    name: 'Paracetamol Syrup',
    dosage: '100ml Bottle',
    category: 'Analgesics',
    price: 320.00,
    stock: 12,
    batchNumber: '#PS-2024-089',
    expiryDate: '2024-06-15',
    status: 'Low Stock',
    type: 'medication_liquid'
  },
  {
    id: '3',
    name: 'Insulin Glargine',
    dosage: 'Injection',
    category: 'Antidiabetic',
    price: 890.00,
    stock: 45,
    batchNumber: '#IG-2023-V12',
    expiryDate: '2024-05-20',
    status: 'Expiring',
    type: 'vaccines'
  },
  {
    id: '4',
    name: 'Lisinopril',
    dosage: '10mg',
    category: 'Hypertension',
    price: 120.00,
    stock: 15,
    batchNumber: '#RX-8842',
    expiryDate: '2025-01-10',
    status: 'Pending',
    type: 'pill'
  }
];

export const MOCK_PHARMACISTS: Pharmacist[] = [
  {
    id: '1',
    name: 'Dr. Julian Vance',
    role: 'Senior Clinical Lead',
    employeeId: 'RX-9042',
    email: 'julian.v@rediate.com',
    phone: '+1 (555) 902-1244',
    status: 'Approved',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4U0Bjf9gCoKPnm2nQyD7chKXjQsQHnBdmwquzZTs4CqVynYg8-59c0gMwLxEdOY147MkFSdXstxhbBec2RxKvVt8zLoYDZuWGiO9UmkPak7SBI8qS43hVyqC_-TSWkfpFSAqf1kdX5sggfAtPSJdKyffao4I3cZqqjDebZuxv8LUguNRzmt2FJIC1XgQ1G5Xcn2_tlRZbnhgzYOQDv4HeZj_7yGJl-d8Q6MKM68kxAvdUDGxvL-MguB4S50EIG1k7lKKxQzm173s'
  },
  {
    id: '2',
    name: 'Sarah Sterling',
    role: 'Inventory Specialist',
    employeeId: 'RX-8821',
    email: 's.sterling@rediate.com',
    phone: '+1 (555) 433-8812',
    status: 'Approved',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmKwUNpKXPfRE8uiQa937xkeuESp5f_jOQ6Urp52hsaTt6lO0c9e6bZCorun1b8RR3erTnQo6luCqkla-vRD3NLVWOJ_0AMoZlHnmaAQUZmD7J3daYAxfMQTuuKzYSKwenKoqjqH7ylJmWilLbRF03SwCcjU2Fqz_HicA_KWK8fP79keiHRtYqyV_HDxpKZGwY3ix-DfLmQ6KE56kHu8l4rEl7K6RijdW9hhS3xYZ9xC5STUEQrZmbVK-mXkvuAKMimAFFPVhJgy8'
  }
];
