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
import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/Button";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const { login } = useAuth();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [role, setRole] = useState<UserRole>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert(t("error"), "Preencha todos os campos");
      return;
    }
    setLoading(true);
    const success = await login(email, password, role);
    setLoading(false);
    if (success) {
      if (role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/(tabs)");
      }
    } else {
      Alert.alert(t("error"), "Credenciais inválidas. Verifique seu e-mail e senha.");
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: topPad + 20, paddingBottom: bottomPad + 40 }} keyboardShouldPersistTaps="handled">
        {/* Back */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>

        {/* Title */}
        <View style={styles.titleSection}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Feather name="shopping-bag" size={32} color="#fff" />
          </View>
          <Text style={[styles.appName, { color: colors.foreground }]}>OrderControl</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Bem-vindo de volta!</Text>
        </View>

        {/* Role toggle */}
        <View style={[styles.toggle, { backgroundColor: colors.card }]}>
          {(["customer", "admin"] as UserRole[]).map((r) => (
            <Pressable key={r} onPress={() => setRole(r)} style={[styles.toggleBtn, { backgroundColor: role === r ? colors.primary : "transparent" }]}>
              <Feather name={r === "customer" ? "user" : "shield"} size={16} color={role === r ? "#fff" : colors.mutedForeground} />
              <Text style={{ color: role === r ? "#fff" : colors.mutedForeground, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
                {r === "customer" ? "Cliente" : "Admin"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Fields */}
        <View style={styles.form}>
          <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="mail" size={18} color={colors.mutedForeground} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={t("email")}
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>
          <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="lock" size={18} color={colors.mutedForeground} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t("password")}
              placeholderTextColor={colors.mutedForeground}
              secureTextEntry={!showPassword}
              style={[styles.input, { color: colors.foreground }]}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={colors.mutedForeground} />
            </Pressable>
          </View>

          {role === "admin" && (
            <View style={[styles.hint, { backgroundColor: colors.accent }]}>
              <Feather name="info" size={14} color={colors.primary} />
              <Text style={[styles.hintText, { color: colors.primary }]}>
                Demo admin: admin@ordercontrol.com / admin123
              </Text>
            </View>
          )}

          <Button title={loading ? t("loading") : t("login")} onPress={handleLogin} loading={loading} fullWidth style={{ marginTop: 8 }} />

          <Pressable onPress={() => router.push("/auth/register")} style={styles.registerLink}>
            <Text style={[styles.registerText, { color: colors.mutedForeground }]}>
              {t("dont_have_account")}{" "}
              <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>Cadastre-se</Text>
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
  appName: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular" },
  toggle: { flexDirection: "row", borderRadius: 14, padding: 4, gap: 4, marginBottom: 24 },
  toggleBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 10, borderRadius: 10 },
  form: { gap: 14 },
  inputGroup: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", padding: 0 },
  hint: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10 },
  hintText: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
  registerLink: { alignItems: "center", paddingVertical: 8 },
  registerText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
