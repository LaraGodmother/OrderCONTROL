import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
import { useOrders } from "@/context/OrderContext";

export default function AdminReportsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const router = useRouter();
  const { getAllOrders } = useOrders();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");

  const allOrders = getAllOrders();
  const now = new Date();
  const filtered = allOrders.filter((o) => {
    const d = new Date(o.createdAt);
    if (period === "day") return d.toDateString() === now.toDateString();
    if (period === "week") return now.getTime() - d.getTime() < 7 * 24 * 3600000;
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const revenue = filtered.reduce((sum, o) => sum + o.total, 0);
  const delivered = filtered.filter((o) => o.status === "delivered").length;
  const cancelled = filtered.filter((o) => o.status === "cancelled").length;
  const avgOrder = filtered.length > 0 ? revenue / filtered.length : 0;

  const productCounts: Record<string, { name: string; count: number }> = {};
  filtered.forEach((o) => o.items.forEach((item) => {
    if (!productCounts[item.productId]) productCounts[item.productId] = { name: item.name, count: 0 };
    productCounts[item.productId].count += item.quantity;
  }));
  const topProducts = Object.values(productCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  const STATS = [
    { label: "Total de pedidos", value: filtered.length.toString(), icon: "shopping-bag", color: "#2563EB" },
    { label: "Receita total", value: `R$ ${revenue.toFixed(2).replace(".", ",")}`, icon: "dollar-sign", color: "#16A34A" },
    { label: "Entregues", value: delivered.toString(), icon: "check-circle", color: "#16A34A" },
    { label: "Cancelados", value: cancelled.toString(), icon: "x-circle", color: colors.destructive },
    { label: "Ticket médio", value: `R$ ${avgOrder.toFixed(2).replace(".", ",")}`, icon: "trending-up", color: "#7C3AED" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Relatórios</Text>
        <Pressable onPress={() => Alert.alert("", "Exportação disponível na versão completa")} style={[styles.exportBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="download" size={16} color={colors.foreground} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 16 }} showsVerticalScrollIndicator={false}>
        {/* Period toggle */}
        <View style={[styles.toggle, { backgroundColor: colors.card }]}>
          {(["day", "week", "month"] as const).map((p) => (
            <Pressable key={p} onPress={() => setPeriod(p)} style={[styles.toggleBtn, { backgroundColor: period === p ? colors.primary : "transparent" }]}>
              <Text style={[styles.toggleText, { color: period === p ? "#fff" : colors.foreground }]}>
                {p === "day" ? "Hoje" : p === "week" ? "Semana" : "Mês"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.card }]}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + "20" }]}>
                <Feather name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Top products */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Produtos mais vendidos</Text>
          {topProducts.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Nenhum dado disponível</Text>
          ) : (
            topProducts.map((p, i) => (
              <View key={p.name} style={styles.rankRow}>
                <View style={[styles.rankBadge, { backgroundColor: i === 0 ? "#FEF3C7" : colors.muted }]}>
                  <Text style={[styles.rankNum, { color: i === 0 ? "#D97706" : colors.mutedForeground }]}>#{i + 1}</Text>
                </View>
                <Text style={[styles.rankName, { color: colors.foreground }]} numberOfLines={1}>{p.name}</Text>
                <Text style={[styles.rankCount, { color: colors.primary }]}>{p.count} un.</Text>
              </View>
            ))
          )}
        </View>

        {/* Recent orders */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Pedidos recentes</Text>
          {filtered.slice(0, 5).map((order) => (
            <View key={order.id} style={styles.orderRow}>
              <Text style={[styles.orderNum, { color: colors.foreground }]}>{order.orderNumber}</Text>
              <Text style={[styles.orderCustomer, { color: colors.mutedForeground }]} numberOfLines={1}>{order.customerName}</Text>
              <Text style={[styles.orderTotal, { color: colors.primary }]}>R$ {order.total.toFixed(2).replace(".", ",")}</Text>
            </View>
          ))}
          {filtered.length === 0 && <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Sem pedidos neste período</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", flex: 1 },
  exportBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  toggle: { flexDirection: "row", borderRadius: 14, padding: 4, gap: 4 },
  toggleBtn: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 9, borderRadius: 10 },
  toggleText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: { width: "47%", borderRadius: 14, padding: 14, gap: 6 },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  card: { borderRadius: 16, padding: 16, gap: 10 },
  cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 4 },
  rankRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  rankBadge: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  rankNum: { fontSize: 12, fontFamily: "Inter_700Bold" },
  rankName: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  rankCount: { fontSize: 14, fontFamily: "Inter_700Bold" },
  orderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  orderNum: { fontSize: 13, fontFamily: "Inter_700Bold", width: 40 },
  orderCustomer: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  orderTotal: { fontSize: 13, fontFamily: "Inter_700Bold" },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", paddingVertical: 12 },
});
