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
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/Button";

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const { register } = useAuth();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert(t("error"), "Preencha nome, e-mail e senha");
      return;
    }
    if (password.length < 6) {
      Alert.alert(t("error"), "Senha deve ter pelo menos 6 caracteres");
      return;
    }
    setLoading(true);
    await register({ name, email, password, phone, address });
    setLoading(false);
    router.replace("/(tabs)");
  }

  const fields = [
    { label: t("name"), value: name, set: setName, icon: "user", type: "default" as const },
    { label: t("email"), value: email, set: setEmail, icon: "mail", type: "email-address" as const },
    { label: t("password"), value: password, set: setPassword, icon: "lock", type: "default" as const, secure: true },
    { label: t("phone"), value: phone, set: setPhone, icon: "phone", type: "phone-pad" as const },
    { label: t("address"), value: address, set: setAddress, icon: "map-pin", type: "default" as const },
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: topPad + 20, paddingBottom: bottomPad + 40 }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>

        <View style={styles.titleSection}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Feather name="user-plus" size={32} color="#fff" />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Criar conta</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Preencha os dados abaixo</Text>
        </View>

        <View style={styles.form}>
          {fields.map((field) => (
            <View key={field.label} style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name={field.icon as any} size={18} color={colors.mutedForeground} />
              <TextInput
                value={field.value}
                onChangeText={field.set}
                placeholder={field.label}
                placeholderTextColor={colors.mutedForeground}
                keyboardType={field.type}
                secureTextEntry={field.secure && !showPassword}
                autoCapitalize={field.type === "email-address" ? "none" : "words"}
                style={[styles.input, { color: colors.foreground }]}
              />
              {field.secure && (
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={colors.mutedForeground} />
                </Pressable>
              )}
            </View>
          ))}

          <Button title={loading ? t("loading") : t("register")} onPress={handleRegister} loading={loading} fullWidth style={{ marginTop: 8 }} />

          <Pressable onPress={() => router.push("/auth/login")} style={styles.loginLink}>
            <Text style={[styles.loginText, { color: colors.mutedForeground }]}>
              {t("already_have_account")}{" "}
              <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>{t("login")}</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backBtn: { padding: 4, alignSelf: "flex-start", marginBottom: 24 },
  titleSection: { alignItems: "center", gap: 10, marginBottom: 32 },
  logoCircle: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular" },
  form: { gap: 14 },
  inputGroup: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", padding: 0 },
  loginLink: { alignItems: "center", paddingVertical: 8 },
  loginText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
