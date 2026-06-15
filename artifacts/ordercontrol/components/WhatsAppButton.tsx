import { Feather } from "@expo/vector-icons";
import React from "react";
import { Linking, Pressable, StyleSheet, Text } from "react-native";
import { RESTAURANT } from "@/data/restaurant";
import { useLang } from "@/context/LangContext";

interface WhatsAppButtonProps {
  message?: string;
  compact?: boolean;
}

export function WhatsAppButton({ message, compact = false }: WhatsAppButtonProps) {
  const { t } = useLang();
  const msg = message ?? t("whatsapp_default_msg");

  function handlePress() {
    const url = `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(msg)}`;
    Linking.openURL(url).catch(() => {});
  }

  if (compact) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.compactBtn, { opacity: pressed ? 0.85 : 1 }]}
      >
        <Feather name="message-circle" size={16} color="#fff" />
        <Text style={styles.compactText}>WhatsApp</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Feather name="message-circle" size={18} color="#fff" />
      <Text style={styles.text}>{t("contact_whatsapp")}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#25D366",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  text: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 14 },
  compactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#25D366",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  compactText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 12 },
});
