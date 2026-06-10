import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { OrderStatus } from "@/context/OrderContext";
import { useLang } from "@/context/LangContext";

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  received: { bg: "#DBEAFE", text: "#1D4ED8" },
  preparing: { bg: "#FEF3C7", text: "#D97706" },
  ready: { bg: "#D1FAE5", text: "#059669" },
  delivering: { bg: "#EDE9FE", text: "#7C3AED" },
  delivered: { bg: "#D1FAE5", text: "#059669" },
  cancelled: { bg: "#FEE2E2", text: "#DC2626" },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

export function OrderStatusBadge({ status, size = "sm" }: OrderStatusBadgeProps) {
  const { t } = useLang();
  const colors = STATUS_COLORS[status];
  const fontSize = size === "md" ? 13 : 11;
  const paddingH = size === "md" ? 10 : 7;
  const paddingV = size === "md" ? 5 : 3;

  const STATUS_LABELS: Record<OrderStatus, string> = {
    received: t("status_received"),
    preparing: t("status_preparing"),
    ready: t("status_ready"),
    delivering: t("status_delivering"),
    delivered: t("status_delivered"),
    cancelled: t("status_cancelled"),
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg, paddingHorizontal: paddingH, paddingVertical: paddingV },
      ]}
    >
      <Text style={[styles.text, { color: colors.text, fontSize, fontFamily: "Inter_600SemiBold" }]}>
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 20 },
  text: {},
});
