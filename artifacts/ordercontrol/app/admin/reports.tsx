import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
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
import { useRestaurant } from "@/context/RestaurantContext";

export default function AdminReportsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, formatCurrency } = useLang();
  const router = useRouter();
  const { getAllOrders } = useOrders();
  const { restaurant } = useRestaurant();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const [exporting, setExporting] = useState(false);

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
    { label: t("total_orders"), value: filtered.length.toString(), icon: "shopping-bag", color: "#2563EB" },
    { label: t("total_revenue"), value: formatCurrency(revenue), icon: "dollar-sign", color: "#16A34A" },
    { label: t("delivered_plural"), value: delivered.toString(), icon: "check-circle", color: "#16A34A" },
    { label: t("cancelled_plural"), value: cancelled.toString(), icon: "x-circle", color: colors.destructive },
    { label: t("avg_order"), value: formatCurrency(avgOrder), icon: "trending-up", color: "#7C3AED" },
  ];

  function buildHtml() {
    const periodLabel = period === "day" ? t("today") : period === "week" ? t("week") : t("month_label");
    const dateStr = now.toLocaleDateString();

    const statsHtml = STATS.map((s) =>
      `<div class="stat"><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`
    ).join("");

    const topHtml = topProducts.length > 0
      ? `<h2>${t("best_sellers")}</h2>
         <table>
           <thead><tr><th>#</th><th>${t("product_name")}</th><th>Qtd.</th></tr></thead>
           <tbody>${topProducts.map((p, i) =>
             `<tr><td>${i + 1}</td><td>${p.name}</td><td>${p.count}</td></tr>`
           ).join("")}</tbody>
         </table>`
      : "";

    const ordersHtml = filtered.length > 0
      ? `<h2>${t("recent_orders_section")}</h2>
         <table>
           <thead><tr><th>#</th><th>Cliente</th><th>Status</th><th>Total</th><th>Data</th></tr></thead>
           <tbody>${filtered.slice(0, 30).map((o) =>
             `<tr>
               <td>${o.orderNumber}</td>
               <td>${o.customerName}</td>
               <td>${o.status}</td>
               <td>${formatCurrency(o.total)}</td>
               <td>${new Date(o.createdAt).toLocaleDateString()}</td>
             </tr>`
           ).join("")}</tbody>
         </table>`
      : `<p style="color:#888;text-align:center;padding:24px">${t("no_orders_period")}</p>`;

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${t("reports_title")} — ${restaurant.name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; padding: 28px; color: #1A1A1A; background: #fff; font-size: 13px; }
  .header { border-bottom: 3px solid #D4A017; padding-bottom: 16px; margin-bottom: 20px; }
  .header h1 { font-size: 22px; color: #D4A017; }
  .header .subtitle { color: #666; font-size: 13px; margin-top: 4px; }
  .stats { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
  .stat { background: #f8f8f8; border-radius: 8px; padding: 12px 16px; min-width: 130px; flex: 1; border-left: 4px solid #D4A017; }
  .stat-value { font-size: 20px; font-weight: bold; color: #1A1A1A; }
  .stat-label { font-size: 11px; color: #666; margin-top: 3px; }
  h2 { font-size: 15px; color: #1A1A1A; margin: 20px 0 10px; padding-bottom: 6px; border-bottom: 1px solid #eee; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  thead tr { background: #D4A017; }
  thead th { color: #fff; padding: 8px 10px; text-align: left; font-weight: bold; }
  tbody tr:nth-child(even) { background: #fafafa; }
  tbody td { padding: 7px 10px; border-bottom: 1px solid #f0f0f0; }
  .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #eee; color: #aaa; font-size: 10px; text-align: center; }
  @media print { body { padding: 16px; } .no-print { display: none; } }
</style>
</head>
<body>
  <div class="header">
    <h1>📊 ${t("reports_title")} — ${restaurant.name}</h1>
    <div class="subtitle">${periodLabel} · ${dateStr} · ${t("total_orders")}: ${filtered.length}</div>
  </div>
  <div class="stats">${statsHtml}</div>
  ${topHtml}
  ${ordersHtml}
  <div class="footer">OrderControl · ${restaurant.name} · ${new Date().toLocaleString()}</div>
</body>
</html>`;
  }

  async function handleExport() {
    if (filtered.length === 0) {
      Alert.alert("", t("no_orders_period"));
      return;
    }
    setExporting(true);
    try {
      const html = buildHtml();

      if (Platform.OS === "web") {
        const w = window.open("", "_blank");
        if (w) {
          w.document.write(html);
          w.document.close();
          setTimeout(() => w.print(), 400);
        }
        setExporting(false);
        return;
      }

      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: `${t("reports_title")} — ${restaurant.name}`,
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("PDF", `Salvo em:\n${uri}`);
      }
    } catch {
      Alert.alert(t("error"), t("error_pdf"));
    } finally {
      setExporting(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>{t("reports_title")}</Text>
        <Pressable
          onPress={handleExport}
          disabled={exporting}
          style={[styles.exportBtn, { backgroundColor: exporting ? colors.muted : colors.primary }]}
        >
          <Feather name="download" size={16} color={exporting ? colors.mutedForeground : "#fff"} />
          <Text style={[styles.exportText, { color: exporting ? colors.mutedForeground : "#fff" }]}>
            {exporting ? "..." : "PDF"}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 16 }} showsVerticalScrollIndicator={false}>
        {/* Period toggle */}
        <View style={[styles.toggle, { backgroundColor: colors.card }]}>
          {(["day", "week", "month"] as const).map((p) => (
            <Pressable key={p} onPress={() => setPeriod(p)} style={[styles.toggleBtn, { backgroundColor: period === p ? colors.primary : "transparent" }]}>
              <Text style={[styles.toggleText, { color: period === p ? "#fff" : colors.foreground }]}>
                {p === "day" ? t("today") : p === "week" ? t("week") : t("month_label")}
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
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t("best_sellers")}</Text>
          {topProducts.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t("no_data")}</Text>
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
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t("recent_orders_section")}</Text>
          {filtered.slice(0, 5).map((order) => (
            <View key={order.id} style={styles.orderRow}>
              <Text style={[styles.orderNum, { color: colors.foreground }]}>{order.orderNumber}</Text>
              <Text style={[styles.orderCustomer, { color: colors.mutedForeground }]} numberOfLines={1}>{order.customerName}</Text>
              <Text style={[styles.orderTotal, { color: colors.primary }]}>{formatCurrency(order.total)}</Text>
            </View>
          ))}
          {filtered.length === 0 && <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t("no_orders_period")}</Text>}
        </View>

        {/* Export hint */}
        <View style={[styles.exportHint, { backgroundColor: colors.accent }]}>
          <Feather name="info" size={16} color={colors.primary} />
          <Text style={[styles.exportHintText, { color: colors.foreground }]}>
            {Platform.OS === "web"
              ? "Clique em PDF para abrir o relatório e imprimir / salvar como PDF"
              : "Clique em PDF para gerar e compartilhar o relatório em formato PDF"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", flex: 1 },
  exportBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  exportText: { fontSize: 13, fontFamily: "Inter_700Bold" },
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
  exportHint: { borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "flex-start", gap: 10 },
  exportHintText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
});
