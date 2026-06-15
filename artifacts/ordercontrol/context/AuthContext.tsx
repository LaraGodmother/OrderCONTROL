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
  tenantId: string;
}

interface StoredUser extends User {
  password: string;
}

interface TenantEntry {
  adminEmail: string;
  restaurantName: string;
  createdAt: string;
}

type TenantRegistry = Record<string, TenantEntry>;

interface RegisterRestaurantData {
  restaurantName: string;
  adminName: string;
  email: string;
  password: string;
}

interface RegisterCustomerData {
  name: string;
  email: string;
  password: string;
  restaurantCode: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
}

interface AuthContextType {
  user: User | null;
  tenantId: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: UserRole }>;
  registerRestaurant: (data: RegisterRestaurantData) => Promise<{ success: boolean; tenantCode?: string; error?: string }>;
  register: (data: RegisterCustomerData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Omit<User, "id" | "role" | "tenantId">>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  validateRestaurantCode: (code: string) => Promise<boolean>;
}

const TENANTS_KEY = "@ordercontrol_tenants";
const SESSION_KEY = "@ordercontrol_session";
const SEED_KEY = "@ordercontrol_seeded_v1";
const DEFAULT_TENANT_CODE = "DEMO01";

function usersKey(tenantId: string) {
  return `@ordercontrol_${tenantId}_users`;
}

async function seedDefaultAdmin() {
  try {
    const already = await AsyncStorage.getItem(SEED_KEY);
    if (already) return;
    const tenants = await getTenants();
    if (!tenants[DEFAULT_TENANT_CODE]) {
      tenants[DEFAULT_TENANT_CODE] = {
        adminEmail: "admin@ordercontrol.com",
        restaurantName: "OrderControl Restaurant",
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(TENANTS_KEY, JSON.stringify(tenants));
      const adminUser = {
        id: "admin_default",
        name: "Administrador",
        email: "admin@ordercontrol.com",
        role: "admin" as const,
        tenantId: DEFAULT_TENANT_CODE,
        password: "admin123",
      };
      await AsyncStorage.setItem(
        usersKey(DEFAULT_TENANT_CODE),
        JSON.stringify({ [adminUser.id]: adminUser })
      );
      await AsyncStorage.setItem(
        `@ordercontrol_${DEFAULT_TENANT_CODE}_restaurant`,
        JSON.stringify({ name: "OrderControl Restaurant" })
      );
    }
    await AsyncStorage.setItem(SEED_KEY, "1");
  } catch {
  }
}

function generateTenantCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function getTenants(): Promise<TenantRegistry> {
  try {
    const raw = await AsyncStorage.getItem(TENANTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function getUsersForTenant(tenantId: string): Promise<Record<string, StoredUser>> {
  try {
    const raw = await AsyncStorage.getItem(usersKey(tenantId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    seedDefaultAdmin().then(() => loadSession());
  }, []);

  async function loadSession() {
    try {
      const sessionRaw = await AsyncStorage.getItem(SESSION_KEY);
      if (!sessionRaw) return;
      const session: { userId: string; tenantId: string } = JSON.parse(sessionRaw);
      const users = await getUsersForTenant(session.tenantId);
      const stored = users[session.userId];
      if (stored) {
        const { password: _p, ...u } = stored;
        setUser(u);
        setTenantId(session.tenantId);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<{ success: boolean; role?: UserRole }> {
    await new Promise((r) => setTimeout(r, 600));
    const tenants = await getTenants();
    for (const tid of Object.keys(tenants)) {
      const users = await getUsersForTenant(tid);
      const match = Object.values(users).find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (match) {
        const { password: _p, ...u } = match;
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ userId: u.id, tenantId: tid }));
        setUser(u);
        setTenantId(tid);
        return { success: true, role: u.role };
      }
    }
    return { success: false };
  }

  async function registerRestaurant(data: RegisterRestaurantData): Promise<{ success: boolean; tenantCode?: string; error?: string }> {
    await new Promise((r) => setTimeout(r, 800));
    const tenants = await getTenants();
    for (const tid of Object.keys(tenants)) {
      const users = await getUsersForTenant(tid);
      if (Object.values(users).find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
        return { success: false, error: "E-mail já cadastrado em outro restaurante" };
      }
    }
    let tenantCode = generateTenantCode();
    while (tenants[tenantCode]) {
      tenantCode = generateTenantCode();
    }
    tenants[tenantCode] = {
      adminEmail: data.email,
      restaurantName: data.restaurantName,
      createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(TENANTS_KEY, JSON.stringify(tenants));
    const adminUser: StoredUser = {
      id: `admin_${Date.now()}`,
      name: data.adminName,
      email: data.email,
      role: "admin",
      tenantId: tenantCode,
      password: data.password,
    };
    await AsyncStorage.setItem(usersKey(tenantCode), JSON.stringify({ [adminUser.id]: adminUser }));
    await AsyncStorage.setItem(
      `@ordercontrol_${tenantCode}_restaurant`,
      JSON.stringify({ name: data.restaurantName })
    );
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ userId: adminUser.id, tenantId: tenantCode }));
    const { password: _p, ...u } = adminUser;
    setUser(u);
    setTenantId(tenantCode);
    return { success: true, tenantCode };
  }

  async function register(data: RegisterCustomerData): Promise<{ success: boolean; error?: string }> {
    await new Promise((r) => setTimeout(r, 800));
    const tenantCode = data.restaurantCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const tenants = await getTenants();
    if (!tenants[tenantCode]) {
      return { success: false, error: "Código do restaurante inválido. Verifique e tente novamente." };
    }
    const users = await getUsersForTenant(tenantCode);
    if (Object.values(users).find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: "E-mail já cadastrado neste restaurante" };
    }
    const newUser: StoredUser = {
      id: `customer_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      zipCode: data.zipCode,
      role: "customer",
      tenantId: tenantCode,
      password: data.password,
    };
    users[newUser.id] = newUser;
    await AsyncStorage.setItem(usersKey(tenantCode), JSON.stringify(users));
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ userId: newUser.id, tenantId: tenantCode }));
    const { password: _p, ...u } = newUser;
    setUser(u);
    setTenantId(tenantCode);
    return { success: true };
  }

  async function logout() {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
    setTenantId(null);
  }

  async function updateProfile(data: Partial<Omit<User, "id" | "role" | "tenantId">>) {
    if (!user || !tenantId) return;
    const users = await getUsersForTenant(tenantId);
    const stored = users[user.id];
    if (!stored) return;
    const updated: StoredUser = { ...stored, ...data };
    users[user.id] = updated;
    await AsyncStorage.setItem(usersKey(tenantId), JSON.stringify(users));
    const { password: _p, ...u } = updated;
    setUser(u);
  }

  async function changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!user || !tenantId) return { success: false, error: "Não autenticado" };
    const users = await getUsersForTenant(tenantId);
    const stored = users[user.id];
    if (!stored || stored.password !== oldPassword) {
      return { success: false, error: "Senha atual incorreta" };
    }
    if (newPassword.length < 6) {
      return { success: false, error: "Nova senha deve ter pelo menos 6 caracteres" };
    }
    users[user.id] = { ...stored, password: newPassword };
    await AsyncStorage.setItem(usersKey(tenantId), JSON.stringify(users));
    return { success: true };
  }

  async function validateRestaurantCode(code: string): Promise<boolean> {
    const tenantCode = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const tenants = await getTenants();
    return !!tenants[tenantCode];
  }

  return (
    <AuthContext.Provider
      value={{ user, tenantId, isLoading, login, registerRestaurant, register, logout, updateProfile, changePassword, validateRestaurantCode }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
