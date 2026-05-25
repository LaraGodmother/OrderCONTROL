import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  extras?: string[];
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const stored = await AsyncStorage.getItem("@ordercontrol_cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }

  async function saveCart(newItems: CartItem[]) {
    setItems(newItems);
    await AsyncStorage.setItem("@ordercontrol_cart", JSON.stringify(newItems));
  }

  function addItem(item: Omit<CartItem, "id">) {
    const existing = items.find((i) => i.productId === item.productId);
    if (existing) {
      const updated = items.map((i) =>
        i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
      );
      saveCart(updated);
    } else {
      const newItem: CartItem = { ...item, id: Date.now().toString() + Math.random().toString(36).substr(2, 5) };
      saveCart([...items, newItem]);
    }
  }

  function removeItem(id: string) {
    saveCart(items.filter((i) => i.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    saveCart(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }

  function clearCart() {
    saveCart([]);
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
