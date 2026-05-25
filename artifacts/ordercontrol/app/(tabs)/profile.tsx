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
import { useLang, Language } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";

const LANGUAGES: { key: Language; label: string; flag: string }[] = [
  { key: "pt-BR", label: "Português (BR)", flag: "🇧🇷" },
  { key: "en", label: "English", flag: "🇺🇸" },
  { key: "es", label: "Español", flag: "🇪🇸" },
  { key: "fr", label: "Français", flag: "🇫🇷" },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, language, setLanguage } = useLang();
  const { user, logout, updateProfile } = useAuth();
  const { getUnreadCount } = useChat();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [saving, setSaving] = useState(false);

  const chatUnread = user ? getUnreadCount(user.id) : 0;

  async function handleSave() {
    setSaving(true);
    await updateProfile({ name, phone, address, city });
    setSaving(false);
    setEditing(false);
  }

  async function handleLogout() {
    await logout();
    router.replace("/auth/login");
  }

  if (!user) {
    return (
      <View style={[styles.loginPrompt, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
          <Feather name="user" size={48} color="#fff" />
        </View>
        <Text style={[styles.loginTitle, { color: colors.foreground }]}>{t("login_to_manage")}</Text>
        <Pressable
          onPress={() => router.push("/auth/login")}
          style={[styles.loginBtn, { backgroundColor: colors.primary }]}
        >
          <Feather name="log-in" size={16} color="#fff" />
          <Text style={styles.loginBtnText}>{t("login")}</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/auth/register")}>
          <Text style={[styles.registerLink, { color: colors.primary }]}>
            {t("dont_have_account")} {t("register_link")}
          </Text>
        </Pressable>
      </View>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>{t("profile")}</Text>
        <Pressable
          onPress={handleLogout}
          style={[styles.headerLogout, { borderColor: colors.destructive }]}
        >
          <Feather name="log-out" size={16} color={colors.destructive} />
          <Text style={[styles.headerLogoutText, { color: colors.destructive }]}>{t("logout")}</Text>
        </Pressable>
      </View>

      {/* Avatar */}
      <View style={[styles.avatarSection, { backgroundColor: colors.card }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={[styles.userName, { color: colors.foreground }]}>{user.name}</Text>
        <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>{user.email}</Text>
        {user.role === "admin" && (
          <View style={[styles.adminBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.adminBadgeText}>{t("admin_badge")}</Text>
          </View>
        )}
      </View>

      {/* Admin Panel Button */}
      {user.role === "admin" && (
        <Pressable
          onPress={() => router.push("/admin")}
          style={({ pressed }) => [styles.adminBtn, { backgroundColor: colors.secondary, opacity: pressed ? 0.9 : 1 }]}
        >
          <View style={styles.adminBtnLeft}>
            <Feather name="shield" size={20} color="#fff" />
            <Text style={styles.adminBtnText}>{t("access_admin")}</Text>
          </View>
          <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.7)" />
        </Pressable>
      )}

      {/* Edit Profile */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("edit_profile")}</Text>
          <Pressable onPress={() => setEditing(!editing)}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>
              {editing ? t("cancel") : t("edit")}
            </Text>
          </Pressable>
        </View>
        <View style={styles.fields}>
          {[
            { label: t("name"), value: name, set: setName, key: "name" },
            { label: t("phone"), value: phone, set: setPhone, key: "phone" },
            { label: t("address"), value: address, set: setAddress, key: "address" },
            { label: t("city"), value: city, set: setCity, key: "city" },
          ].map((field) => (
            <View key={field.key} style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{field.label}</Text>
              {editing ? (
                <TextInput
                  value={field.value}
                  onChangeText={field.set}
                  style={[
                    styles.fieldInput,
                    { color: colors.foreground, borderBottomColor: colors.border },
                  ]}
                />
              ) : (
                <Text style={[styles.fieldValue, { color: colors.foreground }]}>
                  {field.value || "—"}
                </Text>
              )}
            </View>
          ))}
          {editing && (
            <Pressable
              onPress={handleSave}
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.saveBtnText}>
                {saving ? t("saving") : t("save")}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Language */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: 10 }]}>
          {t("language")}
        </Text>
        {LANGUAGES.map((lang) => (
          <Pressable
            key={lang.key}
            onPress={() => setLanguage(lang.key)}
            style={[styles.langRow, { borderBottomColor: colors.border, borderBottomWidth: 0.5 }]}
          >
            <Text style={styles.langFlag}>{lang.flag}</Text>
            <Text style={[styles.langLabel, { color: colors.foreground }]}>{lang.label}</Text>
            {language === lang.key && (
              <View style={[styles.langCheck, { backgroundColor: colors.primary + "20" }]}>
                <Feather name="check" size={14} color={colors.primary} />
              </View>
            )}
          </Pressable>
        ))}
      </View>

      {/* Quick Links */}
      <View style={[styles.linksCard, { backgroundColor: colors.card }]}>
        <Pressable
          onPress={() => router.push("/(tabs)/orders")}
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
        >
          <View style={[styles.menuItemIcon, { backgroundColor: "#2563EB20" }]}>
            <Feather name="clock" size={18} color="#2563EB" />
          </View>
          <Text style={[styles.menuItemText, { color: colors.foreground }]}>{t("my_orders")}</Text>
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} style={{ marginLeft: "auto" as any }} />
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/chat")}
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
        >
          <View style={[styles.menuItemIcon, { backgroundColor: colors.primary + "20" }]}>
            <Feather name="message-circle" size={18} color={colors.primary} />
          </View>
          <Text style={[styles.menuItemText, { color: colors.foreground }]}>{t("chat_support")}</Text>
          {chatUnread > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.unreadText}>{chatUnread}</Text>
            </View>
          )}
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} style={{ marginLeft: chatUnread > 0 ? 4 : ("auto" as any) }} />
        </Pressable>

        <Pressable
          onPress={handleLogout}
          style={[styles.menuItem, { borderBottomWidth: 0 }]}
        >
          <View style={[styles.menuItemIcon, { backgroundColor: colors.destructive + "20" }]}>
            <Feather name="log-out" size={18} color={colors.destructive} />
          </View>
          <Text style={[styles.menuItemText, { color: colors.destructive }]}>{t("logout")}</Text>
          <Feather name="chevron-right" size={18} color={colors.destructive} style={{ marginLeft: "auto" as any }} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  headerLogout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerLogoutText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  loginPrompt: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 40,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  loginTitle: { fontSize: 20, fontFamily: "Inter_700Bold", textAlign: "center" },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 14,
  },
  loginBtnText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 16 },
  registerLink: { fontSize: 14, fontFamily: "Inter_500Medium" },
  avatarSection: {
    alignItems: "center",
    padding: 28,
    gap: 6,
    margin: 16,
    borderRadius: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarText: { color: "#fff", fontSize: 32, fontFamily: "Inter_700Bold" },
  userName: { fontSize: 20, fontFamily: "Inter_700Bold" },
  userEmail: { fontSize: 14, fontFamily: "Inter_400Regular" },
  adminBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
  },
  adminBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  adminBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },
  adminBtnLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  adminBtnText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 15 },
  section: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, padding: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 14, fontFamily: "Inter_500Medium" },
  fields: { gap: 14 },
  field: { gap: 4 },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  fieldValue: { fontSize: 15, fontFamily: "Inter_500Medium" },
  fieldInput: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  saveBtn: { marginTop: 14, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  saveBtnText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 15 },
  langRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12 },
  langFlag: { fontSize: 22 },
  langLabel: { fontSize: 15, fontFamily: "Inter_500Medium", flex: 1 },
  langCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  linksCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemText: { fontSize: 15, fontFamily: "Inter_500Medium" },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    marginLeft: "auto" as any,
  },
  unreadText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
});
