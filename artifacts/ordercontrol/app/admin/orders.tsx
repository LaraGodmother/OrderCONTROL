import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useLang } from "@/context/LangContext";
import { useOrders, OrderStatus } from "@/context/OrderContext";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";

const FILTER_TABS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "received", label: "Recebidos" },
  { key: "preparing", label: "Preparando" },
  { key: "ready", label: "Prontos" },
  { key: "delivering", label: "Entrega" },
  { key: "delivered", label: "Entregues" },
  { key: "cancelled", label: "Cancelados" },
];

export default function AdminOrdersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const router = useRouter();
  const { getAllOrders, updateOrderStatus } = useOrders();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const allOrders = getAllOrders().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const filtered = filter === "all" ? allOrders : allOrders.filter((o) => o.status === filter);

  function nextStatus(current: OrderStatus): OrderStatus | null {
    const flow: Record<string, OrderStatus> = { received: "preparing", preparing: "ready", ready: "delivering", delivering: "delivered" };
    return flow[current] ?? null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Pedidos</Text>
        <Text style={[styles.count, { color: colors.mutedForeground }]}>{filtered.length}</Text>
      </View>

      {/* Filter tabs */}
      <FlatList
        horizontal
        data={FILTER_TABS}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
        style={{ flexGrow: 0 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => setFilter(item.key)} style={[styles.filterTab, { backgroundColor: filter === item.key ? colors.primary : colors.card }]}>
            <Text style={[styles.filterText, { color: filter === item.key ? "#fff" : colors.foreground }]}>{item.label}</Text>
          </Pressable>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 10 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Nenhum pedido encontrado</Text>
          </View>
        }
        renderItem={({ item: order }) => {
          const next = nextStatus(order.status);
          return (
            <View style={[styles.orderCard, { backgroundColor: colors.card }]}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={[styles.orderNum, { color: colors.foreground }]}>{order.orderNumber}</Text>
                  <Text style={[styles.customerName, { color: colors.mutedForeground }]}>{order.customerName}</Text>
                </View>
                <OrderStatusBadge status={order.status} />
              </View>

              <Text style={[styles.orderItems, { color: colors.mutedForeground }]} numberOfLines={2}>
                {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
              </Text>

              {order.address && (
                <View style={styles.addressRow}>
                  <Feather name="map-pin" size={13} color={colors.mutedForeground} />
                  <Text style={[styles.addressText, { color: colors.mutedForeground }]} numberOfLines={1}>{order.address}</Text>
                </View>
              )}

              <View style={styles.orderFooter}>
                <Text style={[styles.orderTotal, { color: colors.primary }]}>R$ {order.total.toFixed(2).replace(".", ",")}</Text>
                <Text style={[styles.orderTime, { color: colors.mutedForeground }]}>
                  {new Date(order.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>

              {next && (
                <Pressable onPress={() => updateOrderStatus(order.id, next)} style={[styles.advanceBtn, { backgroundColor: colors.primary }]}>
                  <Text style={styles.advanceBtnText}>Avançar para: {next === "preparing" ? "Preparando" : next === "ready" ? "Pronto" : next === "delivering" ? "Em entrega" : "Entregue"}</Text>
                  <Feather name="arrow-right" size={14} color="#fff" />
                </Pressable>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", flex: 1 },
  count: { fontSize: 14, fontFamily: "Inter_400Regular" },
  filterTab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  filterText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  orderCard: { borderRadius: 16, padding: 14, gap: 10 },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  orderNum: { fontSize: 15, fontFamily: "Inter_700Bold" },
  customerName: { fontSize: 12, fontFamily: "Inter_400Regular" },
  orderItems: { fontSize: 13, fontFamily: "Inter_400Regular" },
  addressRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  addressText: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
  orderFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderTotal: { fontSize: 16, fontFamily: "Inter_700Bold" },
  orderTime: { fontSize: 12, fontFamily: "Inter_400Regular" },
  advanceBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 10, borderRadius: 10 },
  advanceBtnText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  empty: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
