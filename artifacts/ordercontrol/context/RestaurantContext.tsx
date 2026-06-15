import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { RESTAURANT } from "@/data/restaurant";
import { useAuth } from "@/context/AuthContext";

export interface RestaurantConfig {
  name: string;
  tagline: string;
  whatsapp: string;
  phone: string;
  address: string;
  city: string;
  instagram: string;
  facebook: string;
  deliveryFee: number;
  minOrder: number;
  estimatedTime: number;
  isOpen: boolean;
  logoUri?: string;
  coverUri?: string;
}

interface RestaurantContextType {
  restaurant: RestaurantConfig;
  updateRestaurant: (data: Partial<RestaurantConfig>) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

const DEFAULT: RestaurantConfig = {
  name: RESTAURANT.name,
  tagline: RESTAURANT.tagline ?? "Sabor que conquista!",
  whatsapp: RESTAURANT.whatsapp,
  phone: RESTAURANT.phone,
  address: RESTAURANT.address,
  city: RESTAURANT.city ?? "São Paulo, SP",
  instagram: RESTAURANT.instagram ?? "@ordercontrol",
  facebook: RESTAURANT.facebook ?? "OrderControl",
  deliveryFee: RESTAURANT.deliveryFee,
  minOrder: RESTAURANT.minOrder,
  estimatedTime: RESTAURANT.estimatedTime,
  isOpen: RESTAURANT.isOpen,
  logoUri: undefined,
  coverUri: undefined,
};

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const { tenantId } = useAuth();
  const [restaurant, setRestaurant] = useState<RestaurantConfig>(DEFAULT);

  useEffect(() => {
    if (!tenantId) {
      setRestaurant(DEFAULT);
      return;
    }
    const key = `@ordercontrol_${tenantId}_restaurant`;
    AsyncStorage.getItem(key).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw);
          setRestaurant({ ...DEFAULT, ...saved });
        } catch {}
      } else {
        setRestaurant(DEFAULT);
      }
    });
  }, [tenantId]);

  async function updateRestaurant(data: Partial<RestaurantConfig>) {
    if (!tenantId) return;
    const next = { ...restaurant, ...data };
    setRestaurant(next);
    await AsyncStorage.setItem(`@ordercontrol_${tenantId}_restaurant`, JSON.stringify(next));
  }

  return (
    <RestaurantContext.Provider value={{ restaurant, updateRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error("useRestaurant must be used within RestaurantProvider");
  return ctx;
}
