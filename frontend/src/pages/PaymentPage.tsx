import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrder } from "../OrderContext";
import { useAuth } from "../AuthContext";
import { api, ApiItemResponse } from "../lib/api";
import { Order } from "../types";

const PaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orderDraft } = useOrder();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      
      try {
        setLoading(true);
        // If the current draft matches the orderId, use it, otherwise fetch
        if (orderDraft && (orderDraft.id === orderId || orderDraft.orderNumber === orderId)) {
          // Note: OrderDraft doesn't have all fields of Order, so fetching is safer
          const response = await api.get<ApiItemResponse<Order>>(`/orders/${orderId}`);
          setOrder(response.data);
        } else {
          const response = await api.get<ApiItemResponse<Order>>(`/orders/${orderId}`);
          setOrder(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Could not retrieve order details.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, orderDraft]);

  const handlePayment = async (): Promise<void> => {
    if (!order) {
      setError("Order not found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // The backend only really needs the orderId
      const response = await api.post<any>("/payment/initialize", {
        orderId: order.id
      });

      if (response.success && response.checkout_url) {
        // Redirect to Chapa checkout
        window.location.href = response.checkout_url;
      } else {
        throw new Error(response.error || "Failed to initialize payment");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (txRef: string): Promise<void> => {
    try {
      const response = await api.post<any>("/payment/verify", { 
        tx_ref: txRef 
      });

      if (response.success) {
        navigate("/success");
      } else {
        setError(response.error || "Payment verification failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Verification failed");
    }
  };

  // Check for payment status in URL (after redirect from Chapa)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const txRef = params.get("tx_ref");
    const status = params.get("status");

    if (txRef && status === "success") {
      verifyPayment(txRef);
    }
  }, []);

  if (loading && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-bold">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-6 text-center">
        <div>
          <h3 className="text-xl font-bold mb-2">Order not found</h3>
          <p className="text-gray-500 mb-6">We couldn't find the order you're looking for.</p>
          <button onClick={() => navigate("/")} className="text-primary font-bold hover:underline">Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-800 rounded-[32px] shadow-xl border border-gray-100 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">payments</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Payment</h1>
      </div>

      <div className="mb-8 p-6 bg-gray-50 dark:bg-slate-900/50 rounded-[24px] border border-gray-100 dark:border-slate-800">
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Order Summary</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-slate-400">Order Number</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">#{order.orderNumber}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-slate-400">Total Items</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{order.items?.length || 0}</span>
          </div>
          
          <div className="pt-3 border-t border-gray-200 dark:border-slate-800 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900 dark:text-white">Total Amount</span>
            <div className="text-right">
              <p className="text-lg font-black text-primary dark:text-blue-400">
                {order.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-2xl text-sm font-medium flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px]">error</span>
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-5 rounded-2xl font-black text-[15px] shadow-lg transition-all active:scale-[0.98] ${
          loading
            ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            : "bg-primary text-white hover:bg-primary-dark shadow-primary/20"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          "Pay with Chapa"
        )}
      </button>

      <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800 text-center">
        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">Secure Payment Gateway</p>
        <p className="text-xs text-gray-500 dark:text-slate-400">
          You will be redirected to Chapa to complete your transaction securely.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;

