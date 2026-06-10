import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/restaurant";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const colors = useColors();
  const { formatCurrency } = useLang();
  const router = useRouter();
  const { addItem } = useCart();

  const displayPrice = product.promoPrice ?? product.price;

  function handleAddToCart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addItem({
      productId: product.id,
      name: product.name,
      price: displayPrice,
      quantity: 1,
    });
  }

  function handlePress() {
    router.push({ pathname: "/product/[id]", params: { id: product.id } });
  }

  if (compact) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.compactCard,
          { backgroundColor: colors.card, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        {/* Promo badge */}
        {product.isPromo && (
          <View style={[styles.promoBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.promoBadgeText}>PROMO</Text>
          </View>
        )}

        <View style={[styles.compactImagePlaceholder, { backgroundColor: colors.muted }]}>
          <Text style={styles.emoji}>🍽️</Text>
        </View>

        <View style={styles.compactInfo}>
          <Text style={[styles.compactName, { color: colors.foreground }]} numberOfLines={1}>
            {product.name}
          </Text>
          <View style={styles.priceRow}>
            {product.isPromo && product.promoPrice && (
              <Text style={[styles.originalPrice, { color: colors.mutedForeground }]}>
                {formatCurrency(product.price)}
              </Text>
            )}
            <Text style={[styles.price, { color: colors.primary }]}>
              {formatCurrency(displayPrice)}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleAddToCart}
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
        >
          <Feather name="plus" size={16} color="#fff" />
        </Pressable>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.imagePlaceholder, { backgroundColor: colors.muted }]}>
        <Text style={styles.emojiLarge}>🍽️</Text>
        {product.isPromo && (
          <View style={[styles.promoBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.promoBadgeText}>PROMO</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
          {product.description}
        </Text>
        <View style={styles.footer}>
          <View>
            {product.isPromo && product.promoPrice && (
              <Text style={[styles.originalPrice, { color: colors.mutedForeground }]}>
                {formatCurrency(product.price)}
              </Text>
            )}
            <Text style={[styles.price, { color: colors.primary }]}>
              {formatCurrency(displayPrice)}
            </Text>
          </View>
          <Pressable
            onPress={handleAddToCart}
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
          >
            <Feather name="plus" size={16} color="#fff" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    flexDirection: "row",
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiLarge: { fontSize: 36 },
  info: { flex: 1, padding: 12, gap: 4 },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  description: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 6 },
  originalPrice: { fontSize: 11, fontFamily: "Inter_400Regular", textDecorationLine: "line-through" },
  price: { fontSize: 16, fontFamily: "Inter_700Bold" },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  promoBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  promoBadgeText: { color: "#fff", fontSize: 9, fontFamily: "Inter_700Bold" },
  compactCard: {
    borderRadius: 14,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
    marginBottom: 8,
  },
  compactImagePlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 24 },
  compactInfo: { flex: 1, gap: 2 },
  compactName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
});
