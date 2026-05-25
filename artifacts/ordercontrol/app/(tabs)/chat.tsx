import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { useColors } from "@/hooks/useColors";
import { useLang } from "@/context/LangContext";

export default function ChatTab() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const { user } = useAuth();
  const { getConversation, sendMessage, markAsRead } = useChat();
  const router = useRouter();
  const [text, setText] = useState("");
  const flatRef = useRef<FlatList>(null);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const conversation = user ? getConversation(user.id) : undefined;
  const messages = conversation?.messages ?? [];

  useEffect(() => {
    if (user) markAsRead(user.id);
  }, [user?.id, messages.length]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  async function handleSend() {
    if (!text.trim() || !user) return;
    const msg = text.trim();
    setText("");
    await sendMessage(user.id, user.name, user.email, msg, false);
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t("chat_support")}</Text>
        </View>
        <View style={styles.center}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + "20" }]}>
            <Feather name="message-circle" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{t("chat_support")}</Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>{t("login_to_chat")}</Text>
          <Pressable onPress={() => router.push("/auth/login")} style={[styles.loginBtn, { backgroundColor: colors.primary }]}>
            <Feather name="log-in" size={16} color="#fff" />
            <Text style={styles.loginBtnText}>{t("login")}</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/auth/register")}>
            <Text style={[styles.registerLink, { color: colors.primary }]}>{t("dont_have_account")} {t("register")}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <View style={[styles.restaurantAvatar, { backgroundColor: colors.primary }]}>
          <Feather name="coffee" size={18} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t("chat_support")}</Text>
          <View style={styles.onlineRow}>
            <View style={[styles.onlineDot, { backgroundColor: "#16A34A" }]} />
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{t("restaurant_online")}</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, gap: 10, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.center}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + "15" }]}>
              <Feather name="message-circle" size={40} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{t("no_messages")}</Text>
            <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>{t("start_conversation")}</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isMine = !item.isAdmin;
          return (
            <View style={[styles.msgRow, isMine && styles.msgRowRight]}>
              {!isMine && (
                <View style={[styles.msgAvatar, { backgroundColor: colors.primary }]}>
                  <Feather name="coffee" size={13} color="#fff" />
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  isMine
                    ? [styles.bubbleRight, { backgroundColor: colors.primary }]
                    : [styles.bubbleLeft, { backgroundColor: colors.card, borderColor: colors.border }],
                ]}
              >
                <Text style={[styles.bubbleText, { color: isMine ? "#fff" : colors.foreground }]}>{item.content}</Text>
                <Text style={[styles.bubbleTime, { color: isMine ? "rgba(255,255,255,0.65)" : colors.mutedForeground }]}>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Input */}
      <View
        style={[
          styles.inputBar,
          {
            borderTopColor: colors.border,
            backgroundColor: colors.background,
            paddingBottom: Platform.OS === "web" ? 12 : insets.bottom + 8,
          },
        ]}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={t("write_message")}
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
          multiline
          maxLength={500}
        />
        <Pressable
          onPress={handleSend}
          disabled={!text.trim()}
          style={[styles.sendBtn, { backgroundColor: text.trim() ? colors.primary : colors.muted }]}
        >
          <Feather name="send" size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, padding: 32 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  restaurantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  onlineRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  onlineDot: { width: 8, height: 8, borderRadius: 4 },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  iconCircle: { width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center" },
  emptyDesc: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  loginBtnText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 16 },
  registerLink: { fontSize: 14, fontFamily: "Inter_500Medium" },
  msgRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, maxWidth: "82%" },
  msgRowRight: { alignSelf: "flex-end" },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  bubble: { borderRadius: 18, padding: 12, maxWidth: "100%", borderWidth: 1 },
  bubbleLeft: { borderBottomLeftRadius: 4 },
  bubbleRight: { borderBottomRightRadius: 4, borderColor: "transparent" },
  bubbleText: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 21 },
  bubbleTime: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 4, textAlign: "right" },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    maxHeight: 120,
  },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
