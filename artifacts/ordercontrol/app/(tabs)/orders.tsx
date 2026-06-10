import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { useLang, Language } from "@/context/LangContext";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Button } from "@/components/Button";

const LOCALE_MAP: Record<Language, string> = {
  "pt-BR": "pt-BR",
  "pt-PT": "pt-PT",
  "en": "en-US",
  "es": "es-ES",
  "fr": "fr-FR",
};

export default function OrdersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, formatCurrency, language } = useLang();
  const router = useRouter();
  const { user } = useAuth();
  const { getCustomerOrders } = useOrders();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const dateLocale = LOCALE_MAP[language] ?? "pt-BR";

  if (!user) {
    return (
      <View style={[styles.loginPrompt, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <Feather name="package" size={56} color={colors.mutedForeground} />
        <Text style={[styles.promptTitle, { color: colors.foreground }]}>{t("login_to_view_orders")}</Text>
        <Button title={t("login")} onPress={() => router.push("/auth/login")} style={{ marginTop: 8 }} />
      </View>
    );
  }

  const orders = getCustomerOrders(user.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>{t("orders")}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="package" size={56} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{t("no_orders_yet")}</Text>
            <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>{t("make_first_order")}</Text>
            <Button title={t("see_menu")} onPress={() => router.push("/(tabs)/menu")} style={{ marginTop: 8 }} />
          </View>
        ) : (
          orders.map((order) => (
            <Pressable
              key={order.id}
              onPress={() => router.push({ pathname: "/order/[id]", params: { id: order.id } })}
              style={({ pressed }) => [styles.orderCard, { backgroundColor: colors.card, opacity: pressed ? 0.85 : 1 }]}
            >
              <View style={styles.orderHeader}>
                <Text style={[styles.orderNum, { color: colors.foreground }]}>{order.orderNumber}</Text>
                <OrderStatusBadge status={order.status} />
              </View>
              <Text style={[styles.orderItems, { color: colors.mutedForeground }]} numberOfLines={1}>
                {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
              </Text>
              <View style={styles.orderFooter}>
                <Text style={[styles.orderDate, { color: colors.mutedForeground }]}>
                  {new Date(order.createdAt).toLocaleDateString(dateLocale, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </Text>
                <Text style={[styles.orderTotal, { color: colors.primary }]}>{formatCurrency(order.total)}</Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  loginPrompt: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 40 },
  promptTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  empty: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 20, fontFamily: "Inter_700Bold", marginTop: 8 },
  emptyDesc: { fontSize: 14, fontFamily: "Inter_400Regular" },
  orderCard: { borderRadius: 16, padding: 16, marginBottom: 12, gap: 8 },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderNum: { fontSize: 16, fontFamily: "Inter_700Bold" },
  orderItems: { fontSize: 13, fontFamily: "Inter_400Regular" },
  orderFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  orderTotal: { fontSize: 16, fontFamily: "Inter_700Bold" },
});
