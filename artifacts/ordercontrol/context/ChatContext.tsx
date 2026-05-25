import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  isAdmin: boolean;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  customerId: string;
  customerName: string;
  customerEmail: string;
  messages: ChatMessage[];
  lastMessageAt: string;
}

interface ChatContextType {
  conversations: Conversation[];
  sendMessage: (customerId: string, customerName: string, customerEmail: string, content: string, isAdmin: boolean, adminName?: string) => Promise<void>;
  getConversation: (customerId: string) => Conversation | undefined;
  markAsRead: (customerId: string) => Promise<void>;
  getUnreadCount: (customerId: string) => number;
  totalUnread: number;
}

const ChatContext = createContext<ChatContextType | null>(null);
const STORAGE_KEY = "@ordercontrol_chats";

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setConversations(JSON.parse(raw));
        } catch {}
      }
    });
  }, []);

  async function save(data: Conversation[]) {
    setConversations(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  const sendMessage = useCallback(async (
    customerId: string,
    customerName: string,
    customerEmail: string,
    content: string,
    isAdmin: boolean,
    adminName = "Restaurante"
  ) => {
    const msg: ChatMessage = {
      id: Date.now().toString(),
      content,
      senderId: isAdmin ? "admin" : customerId,
      senderName: isAdmin ? adminName : customerName,
      isAdmin,
      timestamp: new Date().toISOString(),
      read: isAdmin,
    };

    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.customerId === customerId);
      let next: Conversation[];
      if (idx >= 0) {
        next = prev.map((c, i) =>
          i === idx
            ? { ...c, messages: [...c.messages, msg], lastMessageAt: msg.timestamp }
            : c
        );
      } else {
        next = [
          ...prev,
          {
            customerId,
            customerName,
            customerEmail,
            messages: [msg],
            lastMessageAt: msg.timestamp,
          },
        ];
      }
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getConversation = useCallback(
    (customerId: string) => conversations.find((c) => c.customerId === customerId),
    [conversations]
  );

  const markAsRead = useCallback(async (customerId: string) => {
    setConversations((prev) => {
      const next = prev.map((c) =>
        c.customerId === customerId
          ? { ...c, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
      );
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getUnreadCount = useCallback(
    (customerId: string) => {
      const conv = conversations.find((c) => c.customerId === customerId);
      if (!conv) return 0;
      return conv.messages.filter((m) => !m.read && !m.isAdmin).length;
    },
    [conversations]
  );

  const totalUnread = conversations.reduce(
    (sum, c) => sum + c.messages.filter((m) => !m.read && !m.isAdmin).length,
    0
  );

  return (
    <ChatContext.Provider value={{ conversations, sendMessage, getConversation, markAsRead, getUnreadCount, totalUnread }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
