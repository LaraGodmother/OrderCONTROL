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

export default function RegisterRestaurantScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const { registerRestaurant } = useAuth();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [restaurantName, setRestaurantName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  async function handleRegister() {
    if (!restaurantName || !adminName || !email || !password) {
      Alert.alert(t("error"), "Preencha todos os campos obrigatórios");
      return;
    }
    if (password.length < 6) {
      Alert.alert(t("error"), "Senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t("error"), t("passwords_dont_match"));
      return;
    }
    setLoading(true);
    const result = await registerRestaurant({ restaurantName, adminName, email, password });
    setLoading(false);
    if (result.success && result.tenantCode) {
      setGeneratedCode(result.tenantCode);
    } else {
      Alert.alert(t("error"), result.error ?? "Erro ao criar restaurante");
    }
  }

  if (generatedCode) {
    return (
      <View style={[styles.successContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.successCard, { backgroundColor: colors.card }]}>
          <View style={[styles.successIcon, { backgroundColor: colors.primary + "20" }]}>
            <Feather name="check-circle" size={56} color={colors.primary} />
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>
            {t("restaurant_created")}
          </Text>
          <Text style={[styles.successSub, { color: colors.mutedForeground }]}>
            {t("share_code_hint")}
          </Text>

          <View style={[styles.codeBox, { backgroundColor: colors.accent, borderColor: colors.primary }]}>
            <Text style={[styles.codeLabel, { color: colors.mutedForeground }]}>
              {t("your_restaurant_code")}
            </Text>
            <Text style={[styles.codeValue, { color: colors.primary }]}>{generatedCode}</Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: colors.muted }]}>
            <Feather name="info" size={16} color={colors.mutedForeground} />
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              {t("code_save_hint")}
            </Text>
          </View>

          <Button
            title={t("access_admin")}
            onPress={() => router.replace("/admin")}
            fullWidth
            style={{ marginTop: 8 }}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: topPad + 20, paddingBottom: bottomPad + 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>

        <View style={styles.titleSection}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Feather name="home" size={32} color="#000" />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>{t("create_restaurant")}</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {t("create_restaurant_subtitle")}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="home" size={18} color={colors.mutedForeground} />
            <TextInput
              value={restaurantName}
              onChangeText={setRestaurantName}
              placeholder={t("restaurant_name")}
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="words"
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>

          <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="user" size={18} color={colors.mutedForeground} />
            <TextInput
              value={adminName}
              onChangeText={setAdminName}
              placeholder={t("admin_your_name")}
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="words"
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>

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

          <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="lock" size={18} color={colors.mutedForeground} />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t("confirm_password")}
              placeholderTextColor={colors.mutedForeground}
              secureTextEntry={!showPassword}
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>

          <Button
            title={loading ? t("loading") : t("create_restaurant_btn")}
            onPress={handleRegister}
            loading={loading}
            fullWidth
            style={{ marginTop: 8 }}
          />

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
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center" },
  form: { gap: 14 },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", padding: 0 },
  loginLink: { alignItems: "center", paddingVertical: 8 },
  loginText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  successContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  successCard: { width: "100%", borderRadius: 24, padding: 28, alignItems: "center", gap: 16 },
  successIcon: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: 24, fontFamily: "Inter_700Bold", textAlign: "center" },
  successSub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  codeBox: {
    width: "100%",
    alignItems: "center",
    gap: 6,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
  },
  codeLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  codeValue: { fontSize: 36, fontFamily: "Inter_700Bold", letterSpacing: 8 },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    width: "100%",
  },
  infoText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
});
