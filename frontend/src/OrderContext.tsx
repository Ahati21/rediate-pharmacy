import React, { createContext, useContext, useMemo, useState } from 'react';

export interface SelectedOrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface PrescriptionDraft {
  doctorName: string;
  notes: string;
  fileName?: string;
}

interface OrderDraft {
  id?: string;
  orderNumber?: string;
  items: SelectedOrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  totalAmount: number;
  deliveryAddress?: string;
}

interface OrderContextType {
  prescriptionDraft: PrescriptionDraft | null;
  setPrescriptionDraft: (draft: PrescriptionDraft | null) => void;
  orderDraft: OrderDraft | null;
  setOrderDraft: (draft: OrderDraft | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [prescriptionDraft, setPrescriptionDraft] = useState<PrescriptionDraft | null>(null);
  const [orderDraft, setOrderDraft] = useState<OrderDraft | null>(null);

  const value = useMemo(
    () => ({
      prescriptionDraft,
      setPrescriptionDraft,
      orderDraft,
      setOrderDraft,
    }),
    [orderDraft, prescriptionDraft]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }

  return context;
}
