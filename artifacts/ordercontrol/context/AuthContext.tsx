import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_ADMIN = {
  id: "admin-1",
  name: "Administrador",
  email: "admin@ordercontrol.com",
  role: "admin" as UserRole,
};

const MOCK_CUSTOMER = {
  id: "customer-1",
  name: "João Silva",
  email: "joao@email.com",
  phone: "(11) 99999-9999",
  address: "Rua das Flores, 123",
  city: "São Paulo",
  zipCode: "01310-100",
  role: "customer" as UserRole,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const stored = await AsyncStorage.getItem("@ordercontrol_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string, role: UserRole): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 800));
    if (role === "admin" && email === "admin@ordercontrol.com" && password === "admin123") {
      await AsyncStorage.setItem("@ordercontrol_user", JSON.stringify(MOCK_ADMIN));
      setUser(MOCK_ADMIN);
      return true;
    }
    if (role === "customer") {
      const u = { ...MOCK_CUSTOMER, email };
      await AsyncStorage.setItem("@ordercontrol_user", JSON.stringify(u));
      setUser(u);
      return true;
    }
    return false;
  }

  async function register(data: RegisterData): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 1000));
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      zipCode: data.zipCode,
      role: "customer",
    };
    await AsyncStorage.setItem("@ordercontrol_user", JSON.stringify(newUser));
    setUser(newUser);
    return true;
  }

  async function logout() {
    await AsyncStorage.removeItem("@ordercontrol_user");
    setUser(null);
  }

  async function updateProfile(data: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...data };
    await AsyncStorage.setItem("@ordercontrol_user", JSON.stringify(updated));
    setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
