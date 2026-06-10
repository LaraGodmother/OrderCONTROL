import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
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
import { useCart } from "@/context/CartContext";
import { RESTAURANT } from "@/data/restaurant";
import { Button } from "@/components/Button";

export default function CartScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, formatCurrency } = useLang();
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const deliveryFee = itemCount > 0 ? RESTAURANT.deliveryFee : 0;
  const grandTotal = total + deliveryFee;

  if (itemCount === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <Feather name="shopping-cart" size={64} color={colors.mutedForeground} />
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{t("empty_cart")}</Text>
        <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>{t("empty_cart_desc")}</Text>
        <Button title={t("see_menu")} onPress={() => router.push("/(tabs)/menu")} style={{ marginTop: 16 }} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>{t("cart")}</Text>
        <Text style={[styles.count, { color: colors.mutedForeground }]}>
          {itemCount} {itemCount === 1 ? t("item_singular") : t("items_plural")}
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 200 }}
        renderItem={({ item }) => (
          <View style={[styles.cartItem, { backgroundColor: colors.card }]}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.foreground }]} numberOfLines={1}>{item.name}</Text>
              {item.extras && item.extras.length > 0 && (
                <Text style={[styles.itemExtras, { color: colors.mutedForeground }]}>+ {item.extras.join(", ")}</Text>
              )}
              <Text style={[styles.itemPrice, { color: colors.primary }]}>{formatCurrency(item.price * item.quantity)}</Text>
            </View>
            <View style={styles.qtyRow}>
              <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateQuantity(item.id, item.quantity - 1); }} style={[styles.qtyBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Feather name="minus" size={14} color={colors.foreground} />
              </Pressable>
              <Text style={[styles.qty, { color: colors.foreground }]}>{item.quantity}</Text>
              <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateQuantity(item.id, item.quantity + 1); }} style={[styles.qtyBtn, { backgroundColor: colors.primary }]}>
                <Feather name="plus" size={14} color="#fff" />
              </Pressable>
              <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); removeItem(item.id); }} style={styles.removeBtn}>
                <Feather name="trash-2" size={16} color={colors.destructive} />
              </Pressable>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.summaryTitle, { color: colors.foreground }]}>{t("summary")}</Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{t("subtotal")}</Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>{formatCurrency(total)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{t("delivery_fee")}</Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>{formatCurrency(deliveryFee)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.totalLabel, { color: colors.foreground }]}>{t("total")}</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>{formatCurrency(grandTotal)}</Text>
            </View>
          </View>
        }
      />

      <View style={[styles.footer, { borderTopColor: colors.border, paddingBottom: bottomPad + 16, backgroundColor: colors.background }]}>
        <View style={styles.footerTotal}>
          <Text style={[styles.footerTotalLabel, { color: colors.mutedForeground }]}>{t("total")}</Text>
          <Text style={[styles.footerTotalValue, { color: colors.foreground }]}>{formatCurrency(grandTotal)}</Text>
        </View>
        <Pressable onPress={() => router.push("/checkout")} style={({ pressed }) => [styles.checkoutBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }]}>
          <Feather name="chevron-right" size={20} color="#fff" />
          <Text style={styles.checkoutText}>{t("checkout")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 22, fontFamily: "Inter_700Bold", marginTop: 16 },
  emptyDesc: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  count: { fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 2 },
  cartItem: { borderRadius: 16, padding: 14, marginBottom: 10, gap: 10 },
  itemInfo: { gap: 3 },
  itemName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  itemExtras: { fontSize: 12, fontFamily: "Inter_400Regular" },
  itemPrice: { fontSize: 16, fontFamily: "Inter_700Bold" },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  qty: { fontSize: 16, fontFamily: "Inter_600SemiBold", minWidth: 24, textAlign: "center" },
  removeBtn: { marginLeft: "auto" as any, padding: 6 },
  summaryCard: { borderRadius: 16, padding: 16, gap: 10, marginTop: 8 },
  summaryTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 4 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  summaryValue: { fontSize: 14, fontFamily: "Inter_500Medium" },
  totalRow: { borderTopWidth: 1, paddingTop: 10, marginTop: 4 },
  totalLabel: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  totalValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 14, borderTopWidth: 1, gap: 14 },
  footerTotal: { flex: 1 },
  footerTotalLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  footerTotalValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  checkoutBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 22, paddingVertical: 14, borderRadius: 14, gap: 6 },
  checkoutText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
