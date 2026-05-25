import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useChat, Conversation } from "@/context/ChatContext";
import { useColors } from "@/hooks/useColors";
import { useLang } from "@/context/LangContext";

export default function AdminChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const { user } = useAuth();
  const { conversations, sendMessage, markAsRead } = useChat();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [selected, setSelected] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    if (selected) {
      markAsRead(selected.customerId);
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [selected?.customerId, selected?.messages.length]);

  async function handleSend() {
    if (!replyText.trim() || !selected || !user) return;
    const msg = replyText.trim();
    setReplyText("");
    await sendMessage(selected.customerId, selected.customerName, selected.customerEmail, msg, true, user.name);
  }

  const currentConv = selected
    ? conversations.find((c) => c.customerId === selected.customerId)
    : null;

  if (selected && currentConv) {
    return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
          <Pressable onPress={() => setSelected(null)} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <View>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>{currentConv.customerName}</Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{currentConv.customerEmail}</Text>
          </View>
        </View>

        <FlatList
          ref={flatRef}
          data={currentConv.messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16, gap: 8, flexGrow: 1 }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t("no_messages")}</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isMine = item.isAdmin;
            return (
              <View style={[styles.msgRow, isMine && styles.msgRowRight]}>
                {!isMine && (
                  <View style={[styles.msgAvatar, { backgroundColor: colors.secondary }]}>
                    <Text style={styles.msgAvatarText}>{currentConv.customerName.charAt(0).toUpperCase()}</Text>
                  </View>
                )}
                <View style={[styles.bubble, isMine ? [styles.bubbleRight, { backgroundColor: colors.primary }] : [styles.bubbleLeft, { backgroundColor: colors.card }]]}>
                  <Text style={[styles.bubbleText, { color: isMine ? "#fff" : colors.foreground }]}>{item.content}</Text>
                  <Text style={[styles.bubbleTime, { color: isMine ? "rgba(255,255,255,0.65)" : colors.mutedForeground }]}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        <View style={[styles.inputBar, { borderTopColor: colors.border, backgroundColor: colors.background, paddingBottom: Platform.OS === "web" ? 12 : insets.bottom + 8 }]}>
          <TextInput
            value={replyText}
            onChangeText={setReplyText}
            placeholder={t("write_message")}
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
            multiline
            maxLength={500}
          />
          <Pressable onPress={handleSend} disabled={!replyText.trim()} style={[styles.sendBtn, { backgroundColor: replyText.trim() ? colors.primary : colors.muted }]}>
            <Feather name="send" size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t("customer_chats")}</Text>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.center}>
          <Feather name="message-circle" size={64} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t("no_messages")}</Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>Os clientes aparecerão aqui quando enviarem mensagens</Text>
        </View>
      ) : (
        <ScrollView>
          {[...conversations].sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()).map((conv) => {
            const unread = conv.messages.filter((m) => !m.read && !m.isAdmin).length;
            const last = conv.messages[conv.messages.length - 1];
            return (
              <Pressable key={conv.customerId} onPress={() => setSelected(conv)} style={({ pressed }) => [styles.convItem, { backgroundColor: pressed ? colors.muted : colors.card, borderBottomColor: colors.border }]}>
                <View style={[styles.convAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.convAvatarText}>{conv.customerName.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.convTop}>
                    <Text style={[styles.convName, { color: colors.foreground }]}>{conv.customerName}</Text>
                    {last && (
                      <Text style={[styles.convTime, { color: colors.mutedForeground }]}>
                        {new Date(last.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </Text>
                    )}
                  </View>
                  <View style={styles.convBottom}>
                    <Text style={[styles.convLast, { color: colors.mutedForeground }]} numberOfLines={1}>
                      {last ? (last.isAdmin ? "Você: " : "") + last.content : t("no_messages")}
                    </Text>
                    {unread > 0 && (
                      <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.unreadText}>{unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 32 },
  emptyText: { fontSize: 18, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  emptyDesc: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  convItem: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderBottomWidth: 1 },
  convAvatar: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  convAvatarText: { color: "#fff", fontSize: 20, fontFamily: "Inter_700Bold" },
  convTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  convName: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  convTime: { fontSize: 12, fontFamily: "Inter_400Regular" },
  convBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  convLast: { fontSize: 14, fontFamily: "Inter_400Regular", flex: 1 },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
  unreadText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  msgRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, maxWidth: "85%" },
  msgRowRight: { alignSelf: "flex-end" },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  msgAvatarText: { color: "#fff", fontSize: 12, fontFamily: "Inter_700Bold" },
  bubble: { borderRadius: 18, padding: 12, maxWidth: "100%" },
  bubbleLeft: { borderBottomLeftRadius: 4 },
  bubbleRight: { borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 21 },
  bubbleTime: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 4, textAlign: "right" },
  inputBar: { flexDirection: "row", alignItems: "flex-end", gap: 10, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 22, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, fontFamily: "Inter_400Regular", maxHeight: 120 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
