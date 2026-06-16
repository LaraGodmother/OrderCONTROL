import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useLang } from "@/context/LangContext";
import { PRODUCTS, CATEGORIES } from "@/data/restaurant";

export default function AdminProductsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, formatCurrency } = useLang();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [productsState, setProductsState] = useState(PRODUCTS);

  const toggleAvailability = (id: string) => {
    setProductsState((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, available: !p.available } : p
      )
    );
  };

  const filtered = selectedCategory
    ? productsState.filter((p) => p.categoryId === selectedCategory)
    : productsState;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 10, borderBottomColor: colors.border },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>

        <Text style={[styles.title, { color: colors.foreground }]}>
          {t("products")}
        </Text>

        <Pressable
          onPress={() => router.push("/admin/products/new")}
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
        >
          <Feather name="plus" size={18} color="#fff" />
        </Pressable>
      </View>

      {/* Category filter */}
      <FlatList
        horizontal
        data={[{ id: "all", name: t("all_filter"), icon: "🍽️" }, ...CATEGORIES]}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          gap: 8,
        }}
        style={{ flexGrow: 0 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              setSelectedCategory(item.id === "all" ? null : item.id)
            }
            style={[
              styles.chip,
              {
                backgroundColor:
                  (item.id === "all"
                    ? !selectedCategory
                    : selectedCategory === item.id)
                    ? colors.primary
                    : colors.card,
              },
            ]}
          >
            <Text style={styles.chipEmoji}>{item.icon}</Text>
            <Text
              style={[
                styles.chipText,
                {
                  color:
                    (item.id === "all"
                      ? !selectedCategory
                      : selectedCategory === item.id)
                      ? "#fff"
                      : colors.foreground,
                },
              ]}
            >
              {item.name}
            </Text>
          </Pressable>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 10 }}
        renderItem={({ item }) => (
          <View
            style={[styles.productCard, { backgroundColor: colors.card }]}
          >
            <View
              style={[styles.productImage, { backgroundColor: colors.muted }]}
            >
              <Text style={styles.productEmoji}>🍽️</Text>
            </View>

            <View style={styles.productInfo}>
              <Text
                style={[styles.productName, { color: colors.foreground }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>

              <Text
                style={[
                  styles.productCat,
                  { color: colors.mutedForeground },
                ]}
              >
                {
                  CATEGORIES.find((c) => c.id === item.categoryId)?.name
                }
              </Text>

              <View style={styles.priceRow}>
                {item.promoPrice && (
                  <Text
                    style={[
                      styles.origPrice,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {formatCurrency(item.price)}
                  </Text>
                )}

                <Text style={[styles.price, { color: colors.primary }]}>
                  {formatCurrency(item.promoPrice ?? item.price)}
                </Text>
              </View>
            </View>

            <View style={styles.productActions}>
              <Switch
                value={item.available}
                trackColor={{
                  true: colors.primary,
                  false: colors.border,
                }}
                onValueChange={() => toggleAvailability(item.id)}
              />

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/admin/products/edit",
                    params: { id: item.id },
                  })
                }
                style={styles.editBtn}
              >
                <Feather
                  name="edit-2"
                  size={16}
                  color={colors.mutedForeground}
                />
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: { padding: 4 },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    flex: 1,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  chipEmoji: { fontSize: 14 },
  chipText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  productCard: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
  },
  productImage: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  productEmoji: { fontSize: 28 },
  productInfo: {
    flex: 1,
    padding: 12,
    gap: 3,
  },
  productName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  productCat: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  origPrice: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textDecorationLine: "line-through",
  },
  price: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  productActions: {
    paddingRight: 12,
    alignItems: "center",
    gap: 6,
  },
  editBtn: { padding: 6 },
});