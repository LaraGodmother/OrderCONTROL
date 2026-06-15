import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export type OrderStatus = "received" | "preparing" | "ready" | "delivering" | "delivered" | "cancelled";
export type PaymentMethod = "pix" | "cash" | "credit_card" | "pay_on_delivery";
export type DeliveryType = "delivery" | "pickup";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  extras?: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryType: DeliveryType;
  address?: string;
  neighborhood?: string;
  reference?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  estimatedTime: number;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (data: Omit<Order, "id" | "orderNumber" | "createdAt" | "status">) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  getCustomerOrders: (customerId: string) => Order[];
  getAllOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { tenantId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!tenantId) {
      setOrders([]);
      return;
    }
    loadOrders(tenantId);
  }, [tenantId]);

  async function loadOrders(tid: string) {
    try {
      const stored = await AsyncStorage.getItem(`@ordercontrol_${tid}_orders`);
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    }
  }

  async function saveOrders(newOrders: Order[]) {
    if (!tenantId) return;
    setOrders(newOrders);
    await AsyncStorage.setItem(`@ordercontrol_${tenantId}_orders`, JSON.stringify(newOrders));
  }

  function createOrder(data: Omit<Order, "id" | "orderNumber" | "createdAt" | "status">): Order {
    const newOrder: Order = {
      ...data,
      id: Date.now().toString(),
      orderNumber: "#" + String(orders.length + 1).padStart(3, "0"),
      status: "received",
      createdAt: new Date().toISOString(),
    };
    saveOrders([...orders, newOrder]);
    return newOrder;
  }

  function updateOrderStatus(id: string, status: OrderStatus) {
    saveOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  function getCustomerOrders(customerId: string) {
    return orders.filter((o) => o.customerId === customerId);
  }

  function getAllOrders() {
    return orders;
  }

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus, getCustomerOrders, getAllOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
