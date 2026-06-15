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
  const [restaurantCode, setRestaurantCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password || !restaurantCode) {
      Alert.alert(t("error"), t("fill_required_fields"));
      return;
    }
    if (password.length < 6) {
      Alert.alert(t("error"), t("password_min_length"));
      return;
    }
    setLoading(true);
    const result = await register({ name, email, password, phone, address, restaurantCode });
    setLoading(false);
    if (result.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert(t("error"), result.error ?? t("error_register"));
    }
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
            <Feather name="user-plus" size={32} color="#000" />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>{t("register_customer_title")}</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{t("fill_form_below")}</Text>
        </View>

        <View style={styles.form}>
          {/* Restaurant code — first field, most important */}
          <View>
            <Text style={[styles.codeLabel, { color: colors.mutedForeground }]}>
              {t("enter_restaurant_code")}
            </Text>
            <View style={[styles.codeGroup, { backgroundColor: colors.accent, borderColor: colors.primary }]}>
              <Feather name="hash" size={20} color={colors.primary} />
              <TextInput
                value={restaurantCode}
                onChangeText={(v) => setRestaurantCode(v.toUpperCase())}
                placeholder="EX: AB12CD"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="characters"
                maxLength={6}
                style={[styles.codeInput, { color: colors.primary }]}
              />
            </View>
            <Text style={[styles.codeHint, { color: colors.mutedForeground }]}>
              {t("restaurant_code_hint")}
            </Text>
          </View>

          <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="user" size={18} color={colors.mutedForeground} />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t("name")}
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
            <Feather name="phone" size={18} color={colors.mutedForeground} />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder={t("phone")}
              placeholderTextColor={colors.mutedForeground}
              keyboardType="phone-pad"
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>

          <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="map-pin" size={18} color={colors.mutedForeground} />
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder={t("address")}
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>

          <Button
            title={loading ? t("loading") : t("register")}
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
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular" },
  form: { gap: 14 },
  codeLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
  codeGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
  },
  codeInput: { flex: 1, fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: 6, padding: 0 },
  codeHint: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 6 },
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
});
