import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

const CONSENT_KEY = "@ordercontrol_consent_v1";

export function ConsentBanner() {
  const colors = useColors();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CONSENT_KEY).then((val) => {
      if (!val) setVisible(true);
    });
  }, []);

  async function handleAccept() {
    await AsyncStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={[styles.iconRow, { backgroundColor: colors.primary + "20" }]}>
            <Feather name="shield" size={32} color={colors.primary} />
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>
            Sua privacidade é importante
          </Text>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={[styles.body, { color: colors.mutedForeground }]}>
              Antes de continuar, precisamos do seu consentimento conforme a{" "}
              <Text style={{ fontFamily: "Inter_600SemiBold" }}>Lei Geral de Proteção de Dados (LGPD)</Text>{" "}
              e o <Text style={{ fontFamily: "Inter_600SemiBold" }}>GDPR</Text>.
            </Text>

            <Text style={[styles.body, { color: colors.mutedForeground }]}>
              Coletamos apenas os dados necessários para:
            </Text>

            <View style={styles.list}>
              {[
                "Processar e entregar seus pedidos",
                "Comunicação via chat com o restaurante",
                "Salvar suas preferências de idioma",
                "Autenticar sua conta com segurança",
              ].map((item) => (
                <View key={item} style={styles.listItem}>
                  <Feather name="check" size={14} color={colors.primary} />
                  <Text style={[styles.listText, { color: colors.mutedForeground }]}>{item}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.body, { color: colors.mutedForeground }]}>
              Não vendemos ou compartilhamos seus dados com terceiros para fins de marketing.
              Armazenamos apenas o necessário pelo tempo exigido por lei.
            </Text>

            <Text style={[styles.linksRow, { color: colors.mutedForeground }]}>
              Ao continuar, você concorda com nossa{" "}
              <Text
                style={[styles.link, { color: colors.primary }]}
                onPress={() => { handleAccept(); router.push("/privacy-policy" as any); }}
              >
                Política de Privacidade
              </Text>{" "}
              e nossos{" "}
              <Text
                style={[styles.link, { color: colors.primary }]}
                onPress={() => { handleAccept(); router.push("/terms-of-service" as any); }}
              >
                Termos de Uso
              </Text>
              .
            </Text>
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              onPress={handleAccept}
              style={({ pressed }) => [
                styles.acceptBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Feather name="check-circle" size={18} color="#000" />
              <Text style={[styles.acceptText, { color: "#000" }]}>Aceitar e Continuar</Text>
            </Pressable>
            <Text style={[styles.note, { color: colors.mutedForeground }]}>
              Você pode revogar seu consentimento a qualquer momento nas configurações do perfil.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    maxHeight: "85%",
    gap: 16,
  },
  iconRow: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  scroll: {
    flexGrow: 0,
    maxHeight: 300,
  },
  body: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
    marginBottom: 12,
  },
  list: {
    gap: 8,
    marginBottom: 12,
    paddingLeft: 4,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  listText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    flex: 1,
    lineHeight: 20,
  },
  linksRow: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    marginBottom: 4,
  },
  link: {
    fontFamily: "Inter_600SemiBold",
    textDecorationLine: "underline",
  },
  actions: {
    gap: 10,
  },
  acceptBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  acceptText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  note: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 16,
  },
});
