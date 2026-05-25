import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
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
import { PRODUCTS } from "@/data/restaurant";

export default function AdminPromotionsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const promos = PRODUCTS.filter((p) => p.isPromo);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>{t("promotions")}</Text>
        <Pressable onPress={() => Alert.alert("", "Adicionar promoção disponível na versão completa")} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <Feather name="plus" size={18} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        data={promos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="tag" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Nenhuma promoção ativa</Text>
          </View>
        }
        renderItem={({ item }) => {
          const discount = item.promoPrice ? Math.round(((item.price - item.promoPrice) / item.price) * 100) : 0;
          return (
            <View style={[styles.promoCard, { backgroundColor: colors.card }]}>
              <View style={styles.promoHeader}>
                <View style={[styles.discountBadge, { backgroundColor: "#FEF3C7" }]}>
                  <Text style={[styles.discountText, { color: "#D97706" }]}>-{discount}%</Text>
                </View>
                <Text style={[styles.promoName, { color: colors.foreground }]} numberOfLines={1}>{item.name}</Text>
                <Switch value={item.isPromo} trackColor={{ true: colors.primary, false: colors.border }} onValueChange={() => Alert.alert("", "Controle disponível na versão completa")} />
              </View>
              <View style={styles.priceRow}>
                <View style={styles.priceBlock}>
                  <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>{t("original_price")}</Text>
                  <Text style={[styles.originalPrice, { color: colors.mutedForeground }]}>R$ {item.price.toFixed(2).replace(".", ",")}</Text>
                </View>
                <Feather name="arrow-right" size={16} color={colors.mutedForeground} />
                <View style={styles.priceBlock}>
                  <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>{t("promo_price")}</Text>
                  <Text style={[styles.promoPrice, { color: colors.primary }]}>R$ {item.promoPrice?.toFixed(2).replace(".", ",")}</Text>
                </View>
                <View style={styles.priceBlock}>
                  <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>Economia</Text>
                  <Text style={[styles.saving, { color: colors.success }]}>R$ {((item.price) - (item.promoPrice ?? 0)).toFixed(2).replace(".", ",")}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <Pressable onPress={() => Alert.alert("", "Edição disponível na versão completa")} style={[styles.actionBtn, { backgroundColor: colors.accent }]}>
                  <Feather name="edit-2" size={14} color={colors.primary} />
                  <Text style={[styles.actionText, { color: colors.primary }]}>Editar</Text>
                </Pressable>
                <Pressable onPress={() => Alert.alert("Remover", `Remover promoção de "${item.name}"?`, [{ text: t("cancel"), style: "cancel" }, { text: t("delete"), style: "destructive" }])} style={[styles.actionBtn, { backgroundColor: "#FEE2E2" }]}>
                  <Feather name="trash-2" size={14} color={colors.destructive} />
                  <Text style={[styles.actionText, { color: colors.destructive }]}>Remover</Text>
                </Pressable>
              </View>
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
  addBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  promoCard: { borderRadius: 16, padding: 14, marginBottom: 12, gap: 12 },
  promoHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  discountBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  discountText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  promoName: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold" },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  priceBlock: { alignItems: "center", gap: 2 },
  priceLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  originalPrice: { fontSize: 14, fontFamily: "Inter_400Regular", textDecorationLine: "line-through" },
  promoPrice: { fontSize: 16, fontFamily: "Inter_700Bold" },
  saving: { fontSize: 14, fontFamily: "Inter_700Bold" },
  actions: { flexDirection: "row", gap: 10 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 8, borderRadius: 10 },
  actionText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  empty: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
