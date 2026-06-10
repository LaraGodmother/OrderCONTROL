import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
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
import { RESTAURANT, PRODUCTS, CATEGORIES } from "@/data/restaurant";
import { useRestaurant } from "@/context/RestaurantContext";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const LANG_OPTIONS: { code: Language; flag: string; label: string }[] = [
  { code: "pt-BR", flag: "🇧🇷", label: "PT-BR" },
  { code: "pt-PT", flag: "🇵🇹", label: "PT-PT" },
  { code: "en", flag: "🇺🇸", label: "EN" },
  { code: "es", flag: "🇪🇸", label: "ES" },
  { code: "fr", flag: "🇫🇷", label: "FR" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, language, setLanguage, formatCurrency } = useLang();
  const { restaurant } = useRestaurant();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const featured = PRODUCTS.filter((p) => p.isPromo && p.available);
  const filtered = selectedCategory
    ? PRODUCTS.filter((p) => p.categoryId === selectedCategory && p.available)
    : PRODUCTS.filter((p) => p.available);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Language Switcher Bar — fixed at top */}
      <View
        style={[
          styles.langBar,
          {
            paddingTop: topPad,
            backgroundColor: colors.secondary,
            borderBottomColor: "rgba(255,255,255,0.1)",
          },
        ]}
      >
        {LANG_OPTIONS.map((opt) => {
          const active = language === opt.code;
          return (
            <Pressable
              key={opt.code}
              onPress={() => setLanguage(opt.code)}
              style={[
                styles.langBtn,
                active && { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.langFlag}>{opt.flag}</Text>
              <Text
                style={[
                  styles.langLabel,
                  { color: active ? colors.primaryForeground : "rgba(255,255,255,0.65)" },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <View style={[styles.hero, { backgroundColor: colors.secondary }]}>
          {restaurant.coverUri ? (
            <Image source={{ uri: restaurant.coverUri }} style={styles.coverBg} blurRadius={0} />
          ) : null}
          <View style={[styles.heroOverlay, restaurant.coverUri ? styles.heroOverlayDark : null]}>
            <View style={styles.heroRow}>
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }}>
                {restaurant.logoUri ? (
                  <Image source={{ uri: restaurant.logoUri }} style={styles.logoImg} />
                ) : null}
                <View style={{ flex: 1 }}>
                  <Text style={styles.heroTitle}>{restaurant.name}</Text>
                  <Text style={styles.heroTagline}>{restaurant.tagline}</Text>
                </View>
              </View>
              <Pressable onPress={() => router.push("/notifications")} style={styles.notifBtn}>
                <Feather name="bell" size={22} color="#fff" />
              </Pressable>
            </View>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: restaurant.isOpen ? "#4ADE80" : "#F87171" }]} />
              <Text style={styles.statusText}>{restaurant.isOpen ? t("open_now") : t("closed")}</Text>
              <Text style={styles.statusSeparator}>·</Text>
              <Feather name="clock" size={13} color="rgba(255,255,255,0.7)" />
              <Text style={styles.statusText}>{restaurant.estimatedTime} {t("minutes")}</Text>
              <Text style={styles.statusSeparator}>·</Text>
              <Feather name="map-pin" size={13} color="rgba(255,255,255,0.7)" />
              <Text style={styles.statusText}>{formatCurrency(restaurant.deliveryFee)} {t("delivery_fee")}</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingBottom: 100 }}>
          {/* Featured */}
          {featured.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("featured")}</Text>
                <Pressable onPress={() => router.push("/(tabs)/menu")}>
                  <Text style={[styles.seeAll, { color: colors.primary }]}>{t("see_menu")}</Text>
                </Pressable>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
                {featured.map((p) => (
                  <Pressable
                    key={p.id}
                    onPress={() => router.push({ pathname: "/product/[id]", params: { id: p.id } })}
                    style={({ pressed }) => [styles.featuredCard, { backgroundColor: colors.card, opacity: pressed ? 0.85 : 1 }]}
                  >
                    <View style={[styles.featuredImage, { backgroundColor: colors.muted }]}>
                      <Text style={styles.featuredEmoji}>🍽️</Text>
                      {p.promoPrice && (
                        <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
                          <Text style={[styles.discountText, { color: colors.primaryForeground }]}>
                            -{Math.round(((p.price - p.promoPrice) / p.price) * 100)}%
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={{ padding: 10, gap: 3 }}>
                      <Text style={[styles.featuredName, { color: colors.foreground }]} numberOfLines={1}>{p.name}</Text>
                      {p.promoPrice && (
                        <Text style={[styles.featuredOriginal, { color: colors.mutedForeground }]}>{formatCurrency(p.price)}</Text>
                      )}
                      <Text style={[styles.featuredPrice, { color: colors.primary }]}>{formatCurrency(p.promoPrice ?? p.price)}</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Categories */}
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, marginHorizontal: 16, marginBottom: 12 }]}>{t("categories")}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
              <Pressable
                onPress={() => setSelectedCategory(null)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: !selectedCategory ? colors.primary : colors.card,
                    borderWidth: 1,
                    borderColor: !selectedCategory ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.categoryChipText, { color: !selectedCategory ? colors.primaryForeground : colors.foreground }]}>
                  {t("all") ?? "Todos"}
                </Text>
              </Pressable>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: selectedCategory === cat.id ? colors.primary : colors.card,
                      borderWidth: 1,
                      borderColor: selectedCategory === cat.id ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                  <Text style={[styles.categoryChipText, { color: selectedCategory === cat.id ? colors.primaryForeground : colors.foreground }]}>
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Products */}
          <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </View>

          {/* WhatsApp */}
          <View style={styles.whatsappSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: 12 }]}>{t("prefer_whatsapp")}</Text>
            <WhatsAppButton />
          </View>

          {/* Hours */}
          <View style={[styles.hoursCard, { backgroundColor: colors.card, marginHorizontal: 16 }]}>
            <View style={styles.hoursHeader}>
              <Feather name="clock" size={18} color={colors.primary} />
              <Text style={[styles.hoursTitle, { color: colors.foreground }]}>{t("opening_hours")}</Text>
            </View>
            {RESTAURANT.openingHours.map((h) => (
              <View key={h.day} style={styles.hoursRow}>
                <Text style={[styles.hoursDay, { color: colors.foreground }]}>{h.day}</Text>
                <Text style={[styles.hoursTime, { color: colors.mutedForeground }]}>{h.hours}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  langBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 4,
    borderBottomWidth: 1,
    flexWrap: "wrap",
  },
  langBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  langFlag: { fontSize: 16 },
  langLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  hero: { overflow: "hidden" },
  coverBg: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" },
  heroOverlay: { padding: 16, paddingBottom: 20, gap: 12 },
  heroOverlayDark: { backgroundColor: "rgba(0,0,0,0.45)" },
  heroRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  heroTitle: { color: "#fff", fontSize: 22, fontFamily: "Inter_700Bold" },
  heroTagline: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  logoImg: { width: 48, height: 48, borderRadius: 12, borderWidth: 2, borderColor: "rgba(255,255,255,0.3)" },
  notifBtn: { padding: 8, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)" },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: "Inter_400Regular" },
  statusSeparator: { color: "rgba(255,255,255,0.4)", fontSize: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  featuredCard: { width: 160, borderRadius: 16, overflow: "hidden" },
  featuredImage: { height: 110, alignItems: "center", justifyContent: "center" },
  featuredEmoji: { fontSize: 44 },
  discountBadge: { position: "absolute", top: 6, right: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  discountText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  featuredName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  featuredOriginal: { fontSize: 11, fontFamily: "Inter_400Regular", textDecorationLine: "line-through" },
  featuredPrice: { fontSize: 15, fontFamily: "Inter_700Bold" },
  categoryChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  categoryEmoji: { fontSize: 16 },
  categoryChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  whatsappSection: { marginHorizontal: 16, marginVertical: 24, alignItems: "flex-start" },
  hoursCard: { borderRadius: 16, padding: 16, gap: 10, marginBottom: 24 },
  hoursHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  hoursTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  hoursRow: { flexDirection: "row", justifyContent: "space-between" },
  hoursDay: { fontSize: 14, fontFamily: "Inter_500Medium" },
  hoursTime: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
