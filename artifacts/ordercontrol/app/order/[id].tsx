import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
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
  received:   "check-circle",
  preparing:  "tool",
  ready:      "package",
  delivering: "truck",
  delivered:  "home",
  cancelled:  "x-circle",
};

const STEP_EMOJIS: Record<OrderStatus, string> = {
  received:   "✅",
  preparing:  "👨‍🍳",
  ready:      "🎁",
  delivering: "🚴",
  delivered:  "🏠",
  cancelled:  "❌",
};

const STEP_COLORS: Record<OrderStatus, string> = {
  received:   "#16A34A",
  preparing:  "#F59E0B",
  ready:      "#2563EB",
  delivering: "#7C3AED",
  delivered:  "#16A34A",
  cancelled:  "#DC2626",
};

function PulsingDot({ color, size = 20 }: { color: string; size?: number }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.3, duration: 600, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(opacity, { toValue: 0.6, duration: 600, useNativeDriver: true }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ scale }],
        opacity,
      }}
    />
  );
}

function AnimatedProgressBar({ progress, color }: { progress: number; color: string }) {
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: progress,
      duration: 800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={styles.progressTrack}>
      <Animated.View
        style={[
          styles.progressFill,
          {
            backgroundColor: color,
            width: width.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
          },
        ]}
      />
    </View>
  );
}

function CountdownTimer({ estimatedMinutes, createdAt }: { estimatedMinutes: number; createdAt: string }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    function calc() {
      const created = new Date(createdAt).getTime();
      const eta = created + estimatedMinutes * 60000;
      const diff = Math.max(0, Math.floor((eta - Date.now()) / 1000));
      setRemaining(diff);
    }
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [estimatedMinutes, createdAt]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  if (remaining === 0) return null;

  return (
    <Text style={styles.countdown}>
      ⏱ {mins}:{String(secs).padStart(2, "0")} restantes
    </Text>
  );
}

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
    received:   t("status_received"),
    preparing:  t("status_preparing"),
    ready:      t("status_ready"),
    delivering: t("status_delivering"),
    delivered:  t("status_delivered"),
    cancelled:  t("status_cancelled"),
  };

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Feather name="alert-circle" size={48} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>{t("order_not_found")}</Text>
        <Pressable onPress={() => router.back()} style={[styles.backBtnAlt, { backgroundColor: colors.primary }]}>
          <Text style={{ color: "#000", fontFamily: "Inter_600SemiBold" }}>{t("back")}</Text>
        </Pressable>
      </View>
    );
  }

  const currentStepIndex = order.status === "cancelled" ? -1 : STATUS_STEPS.indexOf(order.status);
  const progress = order.status === "cancelled" ? 0 : (currentStepIndex + 1) / STATUS_STEPS.length;
  const activeColor = order.status === "cancelled" ? "#DC2626" : (STEP_COLORS[order.status] ?? colors.primary);

  function getPaymentLabel(method: string): string {
    if (method === "pix") return t("pix");
    return t(method) ?? method;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.push("/(tabs)/orders")} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>{order.orderNumber}</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {new Date(order.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
          </Text>
        </View>
        <OrderStatusBadge status={order.status} size="md" />
      </View>

      {/* Animated progress bar */}
      {order.status !== "cancelled" && (
        <AnimatedProgressBar progress={progress} color={activeColor} />
      )}

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: bottomPad + 40, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status hero card */}
        {order.status !== "cancelled" ? (
          <View style={[styles.heroCard, { backgroundColor: activeColor + "15", borderColor: activeColor + "40" }]}>
            <View style={[styles.heroIconBg, { backgroundColor: activeColor + "25" }]}>
              <Text style={styles.heroEmoji}>{STEP_EMOJIS[order.status]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroLabel, { color: activeColor }]}>{STEP_LABELS[order.status]}</Text>
              {order.status !== "delivered" && (
                <CountdownTimer estimatedMinutes={order.estimatedTime} createdAt={order.createdAt} />
              )}
              {order.status === "delivered" && (
                <Text style={[styles.heroSub, { color: activeColor }]}>Aproveite sua refeição! 🎉</Text>
              )}
            </View>
          </View>
        ) : (
          <View style={[styles.heroCard, { backgroundColor: "#FEE2E2", borderColor: "#FCA5A5" }]}>
            <Text style={styles.heroEmoji}>❌</Text>
            <Text style={[styles.heroLabel, { color: "#DC2626" }]}>{STEP_LABELS.cancelled}</Text>
          </View>
        )}

        {/* Step tracker */}
        {order.status !== "cancelled" && (
          <View style={[styles.trackingCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              {t("track_order")}
            </Text>
            {STATUS_STEPS.map((step, index) => {
              const done = index <= currentStepIndex;
              const active = index === currentStepIndex;
              const stepColor = done ? STEP_COLORS[step] : colors.border;

              return (
                <View key={step} style={styles.stepRow}>
                  {/* Left: dot + line */}
                  <View style={styles.stepLineCol}>
                    {active ? (
                      <PulsingDot color={stepColor} size={22} />
                    ) : (
                      <View style={[styles.stepDot, { backgroundColor: stepColor, borderColor: stepColor }]}>
                        {done && <Feather name="check" size={10} color="#fff" />}
                      </View>
                    )}
                    {index < STATUS_STEPS.length - 1 && (
                      <View style={[styles.stepConnector, { backgroundColor: index < currentStepIndex ? STEP_COLORS[STATUS_STEPS[index + 1]] : colors.border }]} />
                    )}
                  </View>

                  {/* Right: label + icon */}
                  <View style={[styles.stepContent, { opacity: done ? 1 : 0.45 }]}>
                    <View style={styles.stepLabelRow}>
                      <Text style={[styles.stepLabel, { color: done ? colors.foreground : colors.mutedForeground, fontFamily: active ? "Inter_700Bold" : "Inter_400Regular" }]}>
                        {STEP_LABELS[step]}
                      </Text>
                      <View style={[styles.stepIconBadge, { backgroundColor: done ? stepColor + "20" : colors.muted }]}>
                        <Feather name={STEP_ICONS[step] as any} size={14} color={done ? stepColor : colors.mutedForeground} />
                      </View>
                    </View>
                    {index < STATUS_STEPS.length - 1 && <View style={{ height: 16 }} />}
                  </View>
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
              <View style={[styles.itemQtyBadge, { backgroundColor: colors.primary + "20" }]}>
                <Text style={[styles.itemQtyText, { color: colors.primary }]}>{item.quantity}x</Text>
              </View>
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
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>
              {order.deliveryFee === 0 ? t("free") : formatCurrency(order.deliveryFee)}
            </Text>
          </View>
          <View style={[styles.summaryRowTotal, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>{t("total")}</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>{formatCurrency(order.total)}</Text>
          </View>
        </View>

        {/* Delivery info */}
        {order.deliveryType === "delivery" && order.address && (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t("delivery_address_section")}</Text>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconBg, { backgroundColor: "#2563EB20" }]}>
                <Feather name="map-pin" size={16} color="#2563EB" />
              </View>
              <Text style={[styles.infoText, { color: colors.foreground }]}>
                {order.address}{order.neighborhood ? `, ${order.neighborhood}` : ""}
              </Text>
            </View>
            {order.reference && (
              <View style={styles.infoRow}>
                <View style={[styles.infoIconBg, { backgroundColor: colors.muted }]}>
                  <Feather name="info" size={16} color={colors.mutedForeground} />
                </View>
                <Text style={[styles.infoText, { color: colors.mutedForeground }]}>{order.reference}</Text>
              </View>
            )}
          </View>
        )}

        {/* Payment */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t("payment_method")}</Text>
          <View style={styles.infoRow}>
            <View style={[styles.infoIconBg, { backgroundColor: colors.primary + "20" }]}>
              <Feather name="credit-card" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.infoText, { color: colors.foreground }]}>{getPaymentLabel(order.paymentMethod)}</Text>
          </View>
        </View>

        {/* WhatsApp help */}
        <View style={[styles.helpCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="help-circle" size={18} color={colors.mutedForeground} />
          <Text style={[styles.whatsappLabel, { color: colors.mutedForeground, flex: 1 }]}>{t("order_problem")}</Text>
          <WhatsAppButton message={`${t("whatsapp_order_inquiry")} ${order.orderNumber}.`} compact />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  backBtnAlt: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(0,0,0,0.08)",
    width: "100%",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  heroIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  heroEmoji: { fontSize: 28 },
  heroLabel: { fontSize: 17, fontFamily: "Inter_700Bold" },
  heroSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  countdown: { fontSize: 13, fontFamily: "Inter_500Medium", color: "#666", marginTop: 3 },
  trackingCard: { borderRadius: 20, padding: 20 },
  card: { borderRadius: 20, padding: 16, gap: 10 },
  cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 4 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 16 },
  stepLineCol: { alignItems: "center", width: 22 },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  stepConnector: { width: 2, flex: 1, marginTop: 2, minHeight: 20 },
  stepContent: { flex: 1 },
  stepLabelRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  stepLabel: { fontSize: 15 },
  stepIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  itemQtyBadge: {
    width: 32,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  itemQtyText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  itemName: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  itemPrice: { fontSize: 14, fontFamily: "Inter_500Medium" },
  divider: { borderTopWidth: 1, marginVertical: 4 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  summaryValue: { fontSize: 14, fontFamily: "Inter_500Medium" },
  summaryRowTotal: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, paddingTop: 10, marginTop: 4 },
  totalLabel: { fontSize: 16, fontFamily: "Inter_700Bold" },
  totalValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  infoIconBg: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  infoText: { fontSize: 14, fontFamily: "Inter_400Regular", flex: 1, paddingTop: 6 },
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  whatsappLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
});
