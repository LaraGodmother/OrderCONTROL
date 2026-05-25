import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
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

const MOCK_NOTIFICATIONS = [
  { id: "1", title: "Pedido confirmado!", message: "Seu pedido #001 foi recebido e está sendo preparado.", time: "2 min atrás", icon: "check-circle", color: "#16A34A" },
  { id: "2", title: "Pedido saiu para entrega", message: "Seu pedido #001 está a caminho!", time: "15 min atrás", icon: "truck", color: "#2563EB" },
  { id: "3", title: "Promoção especial!", message: "Combo Família com 15% de desconto hoje!", time: "1h atrás", icon: "tag", color: "#DC2626" },
  { id: "4", title: "Avalie seu pedido", message: "Como foi sua experiência com o pedido #001?", time: "2h atrás", icon: "star", color: "#F59E0B" },
];

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Notificações</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 10 }} showsVerticalScrollIndicator={false}>
        {MOCK_NOTIFICATIONS.map((notif) => (
          <View key={notif.id} style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={[styles.iconContainer, { backgroundColor: notif.color + "20" }]}>
              <Feather name={notif.icon as any} size={22} color={notif.color} />
            </View>
            <View style={styles.content}>
              <Text style={[styles.notifTitle, { color: colors.foreground }]}>{notif.title}</Text>
              <Text style={[styles.notifMessage, { color: colors.mutedForeground }]}>{notif.message}</Text>
              <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>{notif.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 14 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold" },
  card: { flexDirection: "row", gap: 14, padding: 14, borderRadius: 16, alignItems: "flex-start" },
  iconContainer: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  content: { flex: 1, gap: 4 },
  notifTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  notifMessage: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  notifTime: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
