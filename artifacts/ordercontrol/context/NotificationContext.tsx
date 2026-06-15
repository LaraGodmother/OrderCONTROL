import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { useAuth } from "@/context/AuthContext";

export type NotificationType = "order_received" | "order_preparing" | "order_ready" | "order_delivering" | "order_delivered" | "order_cancelled" | "new_order_admin" | "promo" | "chat";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  orderId?: string;
  orderNumber?: string;
  createdAt: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

function storageKey(uid: string | null, tid: string | null) {
  return `@ordercontrol_notifs_${tid ?? "anon"}_${uid ?? "guest"}`;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, tenantId } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const loadedRef = useRef(false);

  const key = storageKey(user?.id ?? null, tenantId);

  useEffect(() => {
    loadedRef.current = false;
    loadNotifications();
  }, [user?.id, tenantId]);

  async function loadNotifications() {
    try {
      const raw = await AsyncStorage.getItem(key);
      setNotifications(raw ? JSON.parse(raw) : []);
      loadedRef.current = true;
    } catch {
      setNotifications([]);
      loadedRef.current = true;
    }
  }

  async function persist(next: AppNotification[]) {
    setNotifications(next);
    try {
      await AsyncStorage.setItem(key, JSON.stringify(next.slice(0, 100)));
    } catch {}
  }

  const addNotification = useCallback(
    (n: Omit<AppNotification, "id" | "createdAt" | "read">) => {
      const notif: AppNotification = {
        ...n,
        id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => {
        const next = [notif, ...prev].slice(0, 100);
        AsyncStorage.setItem(key, JSON.stringify(next)).catch(() => {});
        return next;
      });

      if (Platform.OS !== "web") {
        triggerLocalPush(notif).catch(() => {});
      }
    },
    [key]
  );

  async function triggerLocalPush(notif: AppNotification) {
    try {
      const Notifications = await import("expo-notifications");
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") return;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notif.title,
          body: notif.message,
          data: { orderId: notif.orderId },
        },
        trigger: null,
      });
    } catch {}
  }

  function markRead(id: string) {
    const next = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    persist(next);
  }

  function markAllRead() {
    const next = notifications.map((n) => ({ ...n, read: true }));
    persist(next);
  }

  function clearAll() {
    persist([]);
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, markRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
