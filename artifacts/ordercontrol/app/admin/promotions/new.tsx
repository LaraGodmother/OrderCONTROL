import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

export default function NewPromotionScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [productName, setProductName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [promoPrice, setPromoPrice] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 10,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>

        <Text style={[styles.title, { color: colors.foreground }]}>
          Nova Promoção
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <View>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Produto
          </Text>

          <TextInput
            value={productName}
            onChangeText={setProductName}
            placeholder="Ex: Pizza Calabresa"
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.foreground,
                borderColor: colors.border,
              },
            ]}
          />
        </View>

        <View>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Preço Original
          </Text>

          <TextInput
            value={originalPrice}
            onChangeText={setOriginalPrice}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.foreground,
                borderColor: colors.border,
              },
            ]}
          />
        </View>

        <View>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Preço Promocional
          </Text>

          <TextInput
            value={promoPrice}
            onChangeText={setPromoPrice}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.foreground,
                borderColor: colors.border,
              },
            ]}
          />
        </View>

        <Pressable
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={() => {
  console.log({
    productName,
    originalPrice,
    promoPrice,
  });

  router.back();
}}
        >
          <Text style={styles.saveText}>Salvar Promoção</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  saveBtn: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
});