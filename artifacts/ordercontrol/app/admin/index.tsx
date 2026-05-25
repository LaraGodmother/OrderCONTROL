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
import { useLang } from "@/context/LangContext";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";

export default function AdminDashboard() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const { getAllOrders, updateOrderStatus } = useOrders();
  const { user, logout } = useAuth();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const allOrders = getAllOrders();
  const today = new Date().toDateString();
  const todayOrders = allOrders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const activeOrders = allOrders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const monthRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);

  const STATS = [
    { label: t("orders_today"), value: todayOrders.length.toString(), icon: "shopping-bag", color: "#2563EB" },
    { label: t("revenue_today"), value: `R$ ${todayRevenue.toFixed(2).replace(".", ",")}`, icon: "dollar-sign", color: "#16A34A" },
    { label: t("active_orders"), value: activeOrders.length.toString(), icon: "activity", color: "#F59E0B" },
    { label: t("monthly_revenue"), value: `R$ ${monthRevenue.toFixed(2).replace(".", ",")}`, icon: "trending-up", color: colors.primary },
  ];

  const MENU_ITEMS = [
    { label: "Gerenciar Pedidos", icon: "list", route: "/admin/orders" },
    { label: "Produtos", icon: "package", route: "/admin/products" },
    { label: "Categorias", icon: "grid", route: "/admin/categories" },
    { label: "Promoções", icon: "tag", route: "/admin/promotions" },
    { label: "Configurações do Restaurante", icon: "settings", route: "/admin/settings" },
    { label: "Relatórios", icon: "bar-chart-2", route: "/admin/reports" },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: colors.secondary }]}>
        <View>
          <Text style={styles.headerTitle}>Painel Admin</Text>
          <Text style={styles.headerSub}>Olá, {user?.name?.split(" ")[0] ?? "Admin"}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable onPress={() => router.push("/(tabs)")} style={styles.headerBtn}>
            <Feather name="eye" size={20} color="#fff" />
          </Pressable>
          <Pressable onPress={async () => { await logout(); router.replace("/auth/login"); }} style={styles.headerBtn}>
            <Feather name="log-out" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>

      <View style={{ padding: 16, gap: 16 }}>
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

        {/* Active orders */}
        {activeOrders.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Pedidos Ativos</Text>
              <Pressable onPress={() => router.push("/admin/orders")}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>Ver todos</Text>
              </Pressable>
            </View>
            {activeOrders.slice(0, 3).map((order) => (
              <View key={order.id} style={[styles.orderCard, { backgroundColor: colors.card }]}>
                <View style={styles.orderCardHeader}>
                  <Text style={[styles.orderNumber, { color: colors.foreground }]}>{order.orderNumber} — {order.customerName}</Text>
                  <OrderStatusBadge status={order.status} />
                </View>
                <Text style={[styles.orderItems, { color: colors.mutedForeground }]} numberOfLines={1}>
                  {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                </Text>
                <View style={styles.orderActions}>
                  <Text style={[styles.orderTotal, { color: colors.primary }]}>R$ {order.total.toFixed(2).replace(".", ",")}</Text>
                  {order.status === "received" && (
                    <Pressable onPress={() => updateOrderStatus(order.id, "preparing")} style={[styles.actionBtn, { backgroundColor: colors.success }]}>
                      <Text style={styles.actionBtnText}>{t("accept")}</Text>
                    </Pressable>
                  )}
                  {order.status === "preparing" && (
                    <Pressable onPress={() => updateOrderStatus(order.id, "ready")} style={[styles.actionBtn, { backgroundColor: "#2563EB" }]}>
                      <Text style={styles.actionBtnText}>Pronto</Text>
                    </Pressable>
                  )}
                  {order.status === "ready" && (
                    <Pressable onPress={() => updateOrderStatus(order.id, "delivering")} style={[styles.actionBtn, { backgroundColor: "#7C3AED" }]}>
                      <Text style={styles.actionBtnText}>Enviar</Text>
                    </Pressable>
                  )}
                  {order.status === "delivering" && (
                    <Pressable onPress={() => updateOrderStatus(order.id, "delivered")} style={[styles.actionBtn, { backgroundColor: "#16A34A" }]}>
                      <Text style={styles.actionBtnText}>Entregue</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Menu */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Gerenciamento</Text>
        <View style={styles.menuGrid}>
          {MENU_ITEMS.map((item) => (
            <Pressable key={item.label} onPress={() => router.push(item.route as any)} style={({ pressed }) => [styles.menuItem, { backgroundColor: colors.card, opacity: pressed ? 0.85 : 1 }]}>
              <View style={[styles.menuIcon, { backgroundColor: colors.primary + "15" }]}>
                <Feather name={item.icon as any} size={22} color={colors.primary} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, paddingBottom: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  headerTitle: { color: "#fff", fontSize: 24, fontFamily: "Inter_700Bold" },
  headerSub: { color: "rgba(255,255,255,0.7)", fontSize: 14, fontFamily: "Inter_400Regular" },
  headerActions: { flexDirection: "row", gap: 10 },
  headerBtn: { padding: 8, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.15)" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: { width: "47%", borderRadius: 16, padding: 16, gap: 8 },
  statIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 14, fontFamily: "Inter_500Medium" },
  orderCard: { borderRadius: 14, padding: 14, marginBottom: 10, gap: 8 },
  orderCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderNumber: { fontSize: 14, fontFamily: "Inter_700Bold" },
  orderItems: { fontSize: 13, fontFamily: "Inter_400Regular" },
  orderActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderTotal: { fontSize: 16, fontFamily: "Inter_700Bold" },
  actionBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  actionBtnText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  menuGrid: { gap: 10 },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 16 },
  menuIcon: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  menuLabel: { fontSize: 15, fontFamily: "Inter_500Medium", flex: 1 },
});
