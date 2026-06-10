import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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
import { useCart } from "@/context/CartContext";
import { PRODUCTS, CATEGORIES } from "@/data/restaurant";

export default function ProductDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, formatCurrency } = useLang();
  const { addItem } = useCart();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const product = PRODUCTS.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  if (!product) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Feather name="alert-circle" size={48} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>{t("product_not_found")}</Text>
        <Pressable onPress={() => router.back()} style={[styles.backBtnAlt, { backgroundColor: colors.primary }]}>
          <Text style={{ color: "#fff", fontFamily: "Inter_600SemiBold" }}>{t("back")}</Text>
        </Pressable>
      </View>
    );
  }

  const category = CATEGORIES.find((c) => c.id === product.categoryId);
  const displayPrice = product.promoPrice ?? product.price;
  const lineTotal = displayPrice * quantity;

  function toggleExtra(extra: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedExtras((prev) => prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra]);
  }

  function handleAddToCart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addItem({ productId: product.id, name: product.name, price: displayPrice, quantity, extras: selectedExtras });
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad + 100 }}>
        {/* Image placeholder */}
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.muted, paddingTop: topPad }]}>
          <Text style={styles.imageEmoji}>🍽️</Text>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: "rgba(0,0,0,0.3)" }]}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </Pressable>
          {product.isPromo && product.promoPrice && (
            <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.discountText}>-{Math.round(((product.price - product.promoPrice) / product.price) * 100)}% OFF</Text>
            </View>
          )}
        </View>

        <View style={{ padding: 20, gap: 16 }}>
          {/* Category */}
          {category && (
            <View style={[styles.categoryBadge, { backgroundColor: colors.accent }]}>
              <Text style={styles.categoryEmoji}>{category.icon}</Text>
              <Text style={[styles.categoryName, { color: colors.primary }]}>{category.name}</Text>
            </View>
          )}

          {/* Name & Price */}
          <View>
            <Text style={[styles.productName, { color: colors.foreground }]}>{product.name}</Text>
            <View style={styles.priceRow}>
              {product.isPromo && product.promoPrice && (
                <Text style={[styles.originalPrice, { color: colors.mutedForeground }]}>{formatCurrency(product.price)}</Text>
              )}
              <Text style={[styles.price, { color: colors.primary }]}>{formatCurrency(displayPrice)}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={[styles.descriptionCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("description")}</Text>
            <Text style={[styles.description, { color: colors.mutedForeground }]}>{product.description}</Text>
          </View>

          {/* Extras */}
          {product.extras && product.extras.length > 0 && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("extras")}</Text>
              <View style={styles.extrasList}>
                {product.extras.map((extra) => (
                  <Pressable key={extra} onPress={() => toggleExtra(extra)} style={[styles.extraChip, { backgroundColor: selectedExtras.includes(extra) ? colors.accent : colors.card, borderColor: selectedExtras.includes(extra) ? colors.primary : colors.border }]}>
                    {selectedExtras.includes(extra) && <Feather name="check" size={14} color={colors.primary} />}
                    <Text style={[styles.extraText, { color: selectedExtras.includes(extra) ? colors.primary : colors.foreground }]}>{extra}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("quantity")}</Text>
            <View style={styles.quantityRow}>
              <Pressable onPress={() => { if (quantity > 1) { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setQuantity(q => q - 1); } }} style={[styles.qtyBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="minus" size={18} color={quantity > 1 ? colors.foreground : colors.mutedForeground} />
              </Pressable>
              <Text style={[styles.qtyValue, { color: colors.foreground }]}>{quantity}</Text>
              <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setQuantity(q => q + 1); }} style={[styles.qtyBtn, { backgroundColor: colors.primary }]}>
                <Feather name="plus" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add to cart */}
      <View style={[styles.footer, { paddingBottom: bottomPad + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Pressable onPress={handleAddToCart} style={({ pressed }) => [styles.addBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }]}>
          <Feather name="shopping-cart" size={20} color="#fff" />
          <Text style={styles.addBtnText}>{t("add_to_cart")} · {formatCurrency(lineTotal)}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  backBtnAlt: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  imagePlaceholder: { height: 280, alignItems: "center", justifyContent: "center", position: "relative" },
  imageEmoji: { fontSize: 100 },
  backBtn: { position: "absolute", top: 16, left: 16, width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  discountBadge: { position: "absolute", top: 16, right: 16, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  discountText: { color: "#fff", fontSize: 12, fontFamily: "Inter_700Bold" },
  categoryBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: "flex-start" },
  categoryEmoji: { fontSize: 16 },
  categoryName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  productName: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 8 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  originalPrice: { fontSize: 16, fontFamily: "Inter_400Regular", textDecorationLine: "line-through" },
  price: { fontSize: 28, fontFamily: "Inter_700Bold" },
  descriptionCard: { borderRadius: 16, padding: 16, gap: 8 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 8 },
  description: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  extrasList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  extraChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  extraText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  quantityRow: { flexDirection: "row", alignItems: "center", gap: 20 },
  qtyBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  qtyValue: { fontSize: 22, fontFamily: "Inter_700Bold", minWidth: 32, textAlign: "center" },
  footer: { padding: 16, borderTopWidth: 1 },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  addBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
});
