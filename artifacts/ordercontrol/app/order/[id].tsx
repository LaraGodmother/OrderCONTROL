import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useLang } from "@/context/LangContext";
import { useOrders, OrderStatus } from "@/context/OrderContext";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const STATUS_STEPS: OrderStatus[] = ["received", "preparing", "ready", "delivering", "delivered"];

const STEP_ICONS: Record<OrderStatus, string> = {
  received: "check-circle",
  preparing: "tool",
  ready: "package",
  delivering: "truck",
  delivered: "home",
  cancelled: "x-circle",
};

export default function OrderDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, formatCurrency } = useLang();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useOrders();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const STEP_LABELS: Record<OrderStatus, string> = {
    received: t("status_received"),
    preparing: t("status_preparing"),
    ready: t("status_ready"),
    delivering: t("status_delivering"),
    delivered: t("status_delivered"),
    cancelled: t("status_cancelled"),
  };

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Feather name="alert-circle" size={48} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>{t("order_not_found")}</Text>
        <Pressable onPress={() => router.back()} style={[styles.backBtnAlt, { backgroundColor: colors.primary }]}>
          <Text style={{ color: "#fff", fontFamily: "Inter_600SemiBold" }}>{t("back")}</Text>
        </Pressable>
      </View>
    );
  }

  const currentStepIndex = order.status === "cancelled" ? -1 : STATUS_STEPS.indexOf(order.status);

  function getPaymentLabel(method: string): string {
    if (method === "pix") return t("pix");
    return t(method);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.push("/(tabs)/orders")} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>{order.orderNumber}</Text>
        </View>
        <OrderStatusBadge status={order.status} size="md" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: bottomPad + 40, gap: 20 }} showsVerticalScrollIndicator={false}>
        {/* Confirmed banner */}
        {order.status !== "cancelled" && (
          <View style={[styles.confirmedBanner, { backgroundColor: "#DCFCE7" }]}>
            <Feather name="check-circle" size={24} color="#16A34A" />
            <View>
              <Text style={[styles.confirmedTitle, { color: "#15803D" }]}>{t("order_confirmed")}</Text>
              <Text style={[styles.confirmedSub, { color: "#16A34A" }]}>
                {t("estimated_time")}: {order.estimatedTime} {t("minutes")}
              </Text>
            </View>
          </View>
        )}

        {/* Tracking */}
        {order.status !== "cancelled" && (
          <View style={[styles.trackingCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t("track_order")}</Text>
            {STATUS_STEPS.map((step, index) => {
              const done = index <= currentStepIndex;
              const active = index === currentStepIndex;
              return (
                <View key={step} style={styles.stepRow}>
                  <View style={styles.stepLine}>
                    <View style={[styles.stepDot, { backgroundColor: done ? colors.primary : colors.border, width: active ? 20 : 16, height: active ? 20 : 16, borderRadius: active ? 10 : 8 }]}>
                      {done && <Feather name="check" size={10} color="#fff" />}
                    </View>
                    {index < STATUS_STEPS.length - 1 && (
                      <View style={[styles.stepConnector, { backgroundColor: index < currentStepIndex ? colors.primary : colors.border }]} />
                    )}
                  </View>
                  <Text style={[styles.stepLabel, { color: done ? colors.foreground : colors.mutedForeground, fontFamily: active ? "Inter_700Bold" : "Inter_400Regular" }]}>
                    {STEP_LABELS[step]}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Items */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t("order_items")}</Text>
          {order.items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={[styles.itemQty, { color: colors.primary }]}>{item.quantity}x</Text>
              <Text style={[styles.itemName, { color: colors.foreground }]} numberOfLines={1}>{item.name}</Text>
              <Text style={[styles.itemPrice, { color: colors.foreground }]}>{formatCurrency(item.price * item.quantity)}</Text>
            </View>
          ))}
          <View style={[styles.divider, { borderTopColor: colors.border }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{t("subtotal")}</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>{formatCurrency(order.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{t("delivery_fee")}</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>{order.deliveryFee === 0 ? t("free") : formatCurrency(order.deliveryFee)}</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 6 }]}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>{t("total")}</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>{formatCurrency(order.total)}</Text>
          </View>
        </View>

        {/* Delivery info */}
        {order.deliveryType === "delivery" && order.address && (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t("delivery_address_section")}</Text>
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={16} color={colors.mutedForeground} />
              <Text style={[styles.infoText, { color: colors.foreground }]}>{order.address}{order.neighborhood ? `, ${order.neighborhood}` : ""}</Text>
            </View>
            {order.reference && (
              <View style={styles.infoRow}>
                <Feather name="info" size={16} color={colors.mutedForeground} />
                <Text style={[styles.infoText, { color: colors.mutedForeground }]}>{order.reference}</Text>
              </View>
            )}
          </View>
        )}

        {/* Payment */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t("payment_method")}</Text>
          <View style={styles.infoRow}>
            <Feather name="credit-card" size={16} color={colors.mutedForeground} />
            <Text style={[styles.infoText, { color: colors.foreground }]}>{getPaymentLabel(order.paymentMethod)}</Text>
          </View>
        </View>

        {/* WhatsApp help */}
        <View style={styles.whatsapp}>
          <Text style={[styles.whatsappLabel, { color: colors.mutedForeground }]}>{t("order_problem")}</Text>
          <WhatsAppButton message={`${t("whatsapp_order_inquiry")} ${order.orderNumber}.`} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  backBtnAlt: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold" },
  confirmedBanner: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: 16 },
  confirmedTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  confirmedSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  trackingCard: { borderRadius: 16, padding: 16, gap: 0 },
  card: { borderRadius: 16, padding: 16, gap: 10 },
  cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 8 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 14, marginBottom: 4 },
  stepLine: { alignItems: "center", gap: 0 },
  stepDot: { alignItems: "center", justifyContent: "center" },
  stepConnector: { width: 2, height: 24, marginTop: 2 },
  stepLabel: { fontSize: 14, paddingTop: 1, flex: 1 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  itemQty: { fontSize: 14, fontFamily: "Inter_700Bold", width: 28 },
  itemName: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  itemPrice: { fontSize: 14, fontFamily: "Inter_500Medium" },
  divider: { borderTopWidth: 1, marginVertical: 4 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  summaryValue: { fontSize: 14, fontFamily: "Inter_500Medium" },
  totalLabel: { fontSize: 16, fontFamily: "Inter_700Bold" },
  totalValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  infoText: { fontSize: 14, fontFamily: "Inter_400Regular", flex: 1 },
  whatsapp: { alignItems: "flex-start", gap: 8 },
  whatsappLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
});
