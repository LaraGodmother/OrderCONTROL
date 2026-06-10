import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
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
import { CATEGORIES, PRODUCTS } from "@/data/restaurant";

export default function AdminCategoriesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>{t("categories")}</Text>
        <Pressable onPress={() => Alert.alert("", "Adicionar categoria disponível na versão completa")} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <Feather name="plus" size={18} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 10 }}
        renderItem={({ item }) => {
          const count = PRODUCTS.filter((p) => p.categoryId === item.id).length;
          return (
            <View style={[styles.catCard, { backgroundColor: colors.card }]}>
              <View style={[styles.iconCircle, { backgroundColor: colors.accent }]}>
                <Text style={styles.emoji}>{item.icon}</Text>
              </View>
              <View style={styles.catInfo}>
                <Text style={[styles.catName, { color: colors.foreground }]}>{item.name}</Text>
                <Text style={[styles.catCount, { color: colors.mutedForeground }]}>{t("n_products").replace("{n}", count.toString())}</Text>
              </View>
              <View style={styles.catActions}>
                <Pressable onPress={() => Alert.alert("", "Edição disponível na versão completa")} style={styles.actionBtn}>
                  <Feather name="edit-2" size={16} color={colors.mutedForeground} />
                </Pressable>
                <Pressable onPress={() => Alert.alert("Excluir", `Excluir "${item.name}"?`, [{ text: t("cancel"), style: "cancel" }, { text: t("delete"), style: "destructive" }])} style={styles.actionBtn}>
                  <Feather name="trash-2" size={16} color={colors.destructive} />
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
  catCard: { flexDirection: "row", alignItems: "center", borderRadius: 16, padding: 14, gap: 14 },
  iconCircle: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 26 },
  catInfo: { flex: 1, gap: 3 },
  catName: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  catCount: { fontSize: 13, fontFamily: "Inter_400Regular" },
  catActions: { flexDirection: "row", gap: 6 },
  actionBtn: { padding: 8 },
});
