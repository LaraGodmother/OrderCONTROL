import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { OrderStatus } from "@/context/OrderContext";

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  received: { label: "Recebido", bg: "#DBEAFE", text: "#1D4ED8" },
  preparing: { label: "Preparando", bg: "#FEF3C7", text: "#D97706" },
  ready: { label: "Pronto", bg: "#D1FAE5", text: "#059669" },
  delivering: { label: "Saiu p/ entrega", bg: "#EDE9FE", text: "#7C3AED" },
  delivered: { label: "Entregue", bg: "#D1FAE5", text: "#059669" },
  cancelled: { label: "Cancelado", bg: "#FEE2E2", text: "#DC2626" },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

export function OrderStatusBadge({ status, size = "sm" }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const fontSize = size === "md" ? 13 : 11;
  const paddingH = size === "md" ? 10 : 7;
  const paddingV = size === "md" ? 5 : 3;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg, paddingHorizontal: paddingH, paddingVertical: paddingV },
      ]}
    >
      <Text style={[styles.text, { color: config.text, fontSize, fontFamily: "Inter_600SemiBold" }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 20 },
  text: {},
});
