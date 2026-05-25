import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useLang } from "@/context/LangContext";
import { RESTAURANT } from "@/data/restaurant";

export default function AdminSettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [name, setName] = useState(RESTAURANT.name);
  const [whatsapp, setWhatsapp] = useState(RESTAURANT.whatsapp);
  const [phone, setPhone] = useState(RESTAURANT.phone);
  const [address, setAddress] = useState(RESTAURANT.address);
  const [deliveryFee, setDeliveryFee] = useState(RESTAURANT.deliveryFee.toString());
  const [minOrder, setMinOrder] = useState(RESTAURANT.minOrder.toString());
  const [estimatedTime, setEstimatedTime] = useState(RESTAURANT.estimatedTime.toString());
  const [isOpen, setIsOpen] = useState(RESTAURANT.isOpen);

  function handleSave() {
    Alert.alert(t("success"), "Configurações salvas com sucesso!");
  }

  const FIELDS = [
    { label: t("restaurant_name"), value: name, set: setName, icon: "home", keyboard: "default" as const },
    { label: t("whatsapp"), value: whatsapp, set: setWhatsapp, icon: "message-circle", keyboard: "phone-pad" as const },
    { label: "Telefone", value: phone, set: setPhone, icon: "phone", keyboard: "phone-pad" as const },
    { label: t("address"), value: address, set: setAddress, icon: "map-pin", keyboard: "default" as const },
    { label: `${t("delivery_fee")} (R$)`, value: deliveryFee, set: setDeliveryFee, icon: "truck", keyboard: "decimal-pad" as const },
    { label: `${t("min_order")} (R$)`, value: minOrder, set: setMinOrder, icon: "shopping-bag", keyboard: "decimal-pad" as const },
    { label: `${t("estimated_time")} (min)`, value: estimatedTime, set: setEstimatedTime, icon: "clock", keyboard: "number-pad" as const },
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Configurações</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 16 }} showsVerticalScrollIndicator={false}>
        {/* Open/Closed toggle */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Feather name="power" size={20} color={isOpen ? colors.success : colors.destructive} />
              <View>
                <Text style={[styles.toggleLabel, { color: colors.foreground }]}>Restaurante</Text>
                <Text style={[styles.toggleSub, { color: isOpen ? colors.success : colors.destructive }]}>{isOpen ? t("open_now") : t("closed")}</Text>
              </View>
            </View>
            <Switch value={isOpen} onValueChange={setIsOpen} trackColor={{ true: colors.success, false: colors.destructive }} />
          </View>
        </View>

        {/* Fields */}
        <View style={[styles.card, { backgroundColor: colors.card, gap: 14 }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Informações do restaurante</Text>
          {FIELDS.map((field) => (
            <View key={field.label}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{field.label}</Text>
              <View style={[styles.inputGroup, { borderColor: colors.border }]}>
                <Feather name={field.icon as any} size={16} color={colors.mutedForeground} />
                <TextInput
                  value={field.value}
                  onChangeText={field.set}
                  keyboardType={field.keyboard}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Save */}
        <Pressable onPress={handleSave} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
          <Feather name="save" size={18} color="#fff" />
          <Text style={styles.saveBtnText}>{t("save")}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold" },
  card: { borderRadius: 16, padding: 16 },
  cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 4 },
  toggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  toggleInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  toggleLabel: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  toggleSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 6 },
  inputGroup: { flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, paddingBottom: 8 },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", padding: 0 },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  saveBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
});
