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
import { useLang } from "@/context/LangContext";
import { useNotifications, AppNotification } from "@/context/NotificationContext";

const TYPE_CONFIG: Record<AppNotification["type"], { icon: string; color: string }> = {
  order_received:   { icon: "check-circle",  color: "#16A34A" },
  order_preparing:  { icon: "clock",         color: "#F59E0B" },
  order_ready:      { icon: "package",       color: "#2563EB" },
  order_delivering: { icon: "truck",         color: "#7C3AED" },
  order_delivered:  { icon: "star",          color: "#16A34A" },
  order_cancelled:  { icon: "x-circle",      color: "#DC2626" },
  new_order_admin:  { icon: "shopping-bag",  color: "#2563EB" },
  promo:            { icon: "tag",           color: "#DC2626" },
  chat:             { icon: "message-circle",color: "#F59E0B" },
};

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins} min atrás`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h atrás`;
  const days = Math.floor(hrs / 24);
  return `${days}d atrás`;
}

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLang();
  const { notifications, unreadCount, markAllRead, clearAll, markRead } = useNotifications();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {t("notifications") ?? "Notificações"}
          {unreadCount > 0 && (
            <Text style={{ color: colors.primary }}> ({unreadCount})</Text>
          )}
        </Text>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <Pressable onPress={markAllRead} style={styles.headerBtn}>
              <Feather name="check-square" size={18} color={colors.primary} />
            </Pressable>
          )}
          {notifications.length > 0 && (
            <Pressable onPress={clearAll} style={styles.headerBtn}>
              <Feather name="trash-2" size={18} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
              <Feather name="bell-off" size={40} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              {t("no_notifications") ?? "Nenhuma notificação"}
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
              {t("notifications_appear_here") ?? "Atualizações dos seus pedidos aparecerão aqui"}
            </Text>
          </View>
        ) : (
          notifications.map((notif) => {
            const cfg = TYPE_CONFIG[notif.type] ?? { icon: "bell", color: colors.primary };
            return (
              <Pressable
                key={notif.id}
                onPress={() => {
                  markRead(notif.id);
                  if (notif.orderId) router.push(`/order/${notif.orderId}` as any);
                }}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderLeftWidth: 3,
                    borderLeftColor: notif.read ? "transparent" : cfg.color,
                  },
                ]}
              >
                <View style={[styles.iconContainer, { backgroundColor: cfg.color + "20" }]}>
                  <Feather name={cfg.icon as any} size={22} color={cfg.color} />
                </View>
                <View style={styles.content}>
                  <View style={styles.row}>
                    <Text style={[styles.notifTitle, { color: colors.foreground, flex: 1 }]} numberOfLines={1}>
                      {notif.title}
                    </Text>
                    {!notif.read && (
                      <View style={[styles.unreadDot, { backgroundColor: cfg.color }]} />
                    )}
                  </View>
                  <Text style={[styles.notifMessage, { color: colors.mutedForeground }]} numberOfLines={2}>
                    {notif.message}
                  </Text>
                  <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>
                    {formatRelativeTime(notif.createdAt)}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
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
  title: { fontSize: 20, fontFamily: "Inter_700Bold", flex: 1 },
  headerActions: { flexDirection: "row", gap: 8 },
  headerBtn: { padding: 6 },
  empty: { alignItems: "center", paddingTop: 80, gap: 16 },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  emptyDesc: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", paddingHorizontal: 32, lineHeight: 20 },
  card: { flexDirection: "row", gap: 14, padding: 14, borderRadius: 16, alignItems: "flex-start" },
  iconContainer: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  content: { flex: 1, gap: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  notifTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  notifMessage: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  notifTime: { fontSize: 11, fontFamily: "Inter_400Regular" },
  unreadDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
});
