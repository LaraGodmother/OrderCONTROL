import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

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

const MOCK_ORDERS: Order[] = [
  {
    id: "order-1",
    orderNumber: "#001",
    customerId: "customer-1",
    customerName: "João Silva",
    items: [
      { productId: "1", name: "X-Burguer Premium", price: 32.9, quantity: 2 },
      { productId: "5", name: "Refrigerante Lata", price: 6.0, quantity: 2 },
    ],
    status: "preparing",
    paymentMethod: "pix",
    deliveryType: "delivery",
    address: "Rua das Flores, 123",
    neighborhood: "Centro",
    subtotal: 77.8,
    deliveryFee: 5.0,
    total: 82.8,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    estimatedTime: 30,
  },
  {
    id: "order-2",
    orderNumber: "#002",
    customerId: "customer-2",
    customerName: "Maria Santos",
    items: [
      { productId: "3", name: "Frango Grelhado", price: 28.9, quantity: 1 },
    ],
    status: "received",
    paymentMethod: "credit_card",
    deliveryType: "pickup",
    subtotal: 28.9,
    deliveryFee: 0,
    total: 28.9,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    estimatedTime: 20,
  },
];

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const stored = await AsyncStorage.getItem("@ordercontrol_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        setOrders([...MOCK_ORDERS, ...parsed]);
      }
    } catch {}
  }

  async function saveOrders(newOrders: Order[]) {
    setOrders(newOrders);
    const userOrders = newOrders.filter((o) => !MOCK_ORDERS.find((m) => m.id === o.id));
    await AsyncStorage.setItem("@ordercontrol_orders", JSON.stringify(userOrders));
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
