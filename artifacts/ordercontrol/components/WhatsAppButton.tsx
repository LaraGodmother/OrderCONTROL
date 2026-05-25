import { Feather } from "@expo/vector-icons";
import React from "react";
import { Linking, Pressable, StyleSheet, Text } from "react-native";
import { RESTAURANT } from "@/data/restaurant";

interface WhatsAppButtonProps {
  message?: string;
}

export function WhatsAppButton({ message = "Olá! Gostaria de fazer um pedido." }: WhatsAppButtonProps) {
  function handlePress() {
    const url = `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {});
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Feather name="message-circle" size={18} color="#fff" />
      <Text style={styles.text}>Falar no WhatsApp</Text>
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
});
