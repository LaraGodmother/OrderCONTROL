import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useLang } from "@/context/LangContext";
import { useRestaurant } from "@/context/RestaurantContext";

export default function AdminSettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const router = useRouter();
  const { restaurant, updateRestaurant } = useRestaurant();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [name, setName] = useState(restaurant.name);
  const [tagline, setTagline] = useState(restaurant.tagline);
  const [whatsapp, setWhatsapp] = useState(restaurant.whatsapp);
  const [phone, setPhone] = useState(restaurant.phone);
  const [address, setAddress] = useState(restaurant.address);
  const [city, setCity] = useState(restaurant.city);
  const [instagram, setInstagram] = useState(restaurant.instagram);
  const [facebook, setFacebook] = useState(restaurant.facebook);
  const [deliveryFee, setDeliveryFee] = useState(restaurant.deliveryFee.toString());
  const [minOrder, setMinOrder] = useState(restaurant.minOrder.toString());
  const [estimatedTime, setEstimatedTime] = useState(restaurant.estimatedTime.toString());
  const [isOpen, setIsOpen] = useState(restaurant.isOpen);
  const [logoUri, setLogoUri] = useState<string | undefined>(restaurant.logoUri);
  const [coverUri, setCoverUri] = useState<string | undefined>(restaurant.coverUri);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(restaurant.name);
    setTagline(restaurant.tagline);
    setWhatsapp(restaurant.whatsapp);
    setPhone(restaurant.phone);
    setAddress(restaurant.address);
    setCity(restaurant.city);
    setInstagram(restaurant.instagram);
    setFacebook(restaurant.facebook);
    setDeliveryFee(restaurant.deliveryFee.toString());
    setMinOrder(restaurant.minOrder.toString());
    setEstimatedTime(restaurant.estimatedTime.toString());
    setIsOpen(restaurant.isOpen);
    setLogoUri(restaurant.logoUri);
    setCoverUri(restaurant.coverUri);
  }, [restaurant]);

  async function pickImage(type: "logo" | "cover") {
    if (Platform.OS === "web") {
      // Web: use native file input
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const uri = ev.target?.result as string;
            if (type === "logo") setLogoUri(uri);
            else setCoverUri(uri);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "logo" ? [1, 1] : [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      if (type === "logo") setLogoUri(result.assets[0].uri);
      else setCoverUri(result.assets[0].uri);
    }
  }

  async function handleSave() {
    setSaving(true);
    await updateRestaurant({
      name,
      tagline,
      whatsapp,
      phone,
      address,
      city,
      instagram,
      facebook,
      deliveryFee: parseFloat(deliveryFee) || 0,
      minOrder: parseFloat(minOrder) || 0,
      estimatedTime: parseInt(estimatedTime) || 30,
      isOpen,
      logoUri,
      coverUri,
    });
    setSaving(false);
    Alert.alert(t("success"), t("changes_saved"));
  }

  const FIELDS = [
    { label: t("restaurant_name"), value: name, set: setName, icon: "home", keyboard: "default" as const },
    { label: t("tagline"), value: tagline, set: setTagline, icon: "edit-3", keyboard: "default" as const },
    { label: t("whatsapp"), value: whatsapp, set: setWhatsapp, icon: "message-circle", keyboard: "phone-pad" as const },
    { label: t("phone_label"), value: phone, set: setPhone, icon: "phone", keyboard: "phone-pad" as const },
    { label: t("address"), value: address, set: setAddress, icon: "map-pin", keyboard: "default" as const },
    { label: t("city"), value: city, set: setCity, icon: "map", keyboard: "default" as const },
    { label: `${t("delivery_fee")}`, value: deliveryFee, set: setDeliveryFee, icon: "truck", keyboard: "decimal-pad" as const },
    { label: `${t("min_order")}`, value: minOrder, set: setMinOrder, icon: "shopping-bag", keyboard: "decimal-pad" as const },
    { label: `${t("estimated_time")} (min)`, value: estimatedTime, set: setEstimatedTime, icon: "clock", keyboard: "number-pad" as const },
  ];

  const SOCIAL = [
    { label: "Instagram", value: instagram, set: setInstagram, icon: "instagram" as const },
    { label: "Facebook", value: facebook, set: setFacebook, icon: "facebook" as const },
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>{t("settings")}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60, gap: 16 }} showsVerticalScrollIndicator={false}>

        {/* Cover Photo */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t("cover_photo")}</Text>
          <Pressable onPress={() => pickImage("cover")} style={styles.coverPicker}>
            {coverUri ? (
              <Image source={{ uri: coverUri }} style={styles.coverImage} />
            ) : (
              <View style={[styles.coverPlaceholder, { backgroundColor: colors.muted }]}>
                <Feather name="image" size={40} color={colors.mutedForeground} />
                <Text style={[styles.changePhotoText, { color: colors.mutedForeground }]}>{t("change_photo")}</Text>
              </View>
            )}
            <View style={[styles.changePhotoOverlay, { backgroundColor: colors.primary }]}>
              <Feather name="camera" size={16} color="#fff" />
              <Text style={styles.changePhotoOverlayText}>{t("change_photo")}</Text>
            </View>
          </Pressable>
        </View>

        {/* Logo */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t("logo_photo")}</Text>
          <Pressable onPress={() => pickImage("logo")} style={styles.logoPicker}>
            {logoUri ? (
              <Image source={{ uri: logoUri }} style={styles.logoImage} />
            ) : (
              <View style={[styles.logoPlaceholder, { backgroundColor: colors.muted }]}>
                <Feather name="image" size={32} color={colors.mutedForeground} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={[styles.logoLabel, { color: colors.foreground }]}>{t("logo_photo")}</Text>
              <Text style={[styles.logoSub, { color: colors.mutedForeground }]}>{t("logo_photo_desc")}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {/* Open/Closed toggle */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <View style={[styles.toggleIcon, { backgroundColor: (isOpen ? colors.success : colors.destructive) + "20" }]}>
                <Feather name="power" size={20} color={isOpen ? colors.success : colors.destructive} />
              </View>
              <View>
                <Text style={[styles.toggleLabel, { color: colors.foreground }]}>{name || t("restaurant_name")}</Text>
                <Text style={[styles.toggleSub, { color: isOpen ? colors.success : colors.destructive }]}>
                  {isOpen ? t("open_now") : t("closed")}
                </Text>
              </View>
            </View>
            <Switch value={isOpen} onValueChange={setIsOpen} trackColor={{ true: colors.success, false: colors.destructive }} thumbColor="#fff" />
          </View>
        </View>

        {/* Basic Info */}
        <View style={[styles.card, { backgroundColor: colors.card, gap: 14 }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t("restaurant_info")}</Text>
          {FIELDS.map((field) => (
            <View key={field.label}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{field.label}</Text>
              <View style={[styles.inputGroup, { borderColor: colors.border }]}>
                <Feather name={field.icon as any} size={16} color={colors.mutedForeground} />
                <TextInput
                  value={field.value}
                  onChangeText={field.set}
                  keyboardType={field.keyboard}
                  style={[styles.input, { color: colors.foreground }]}
                  placeholderTextColor={colors.mutedForeground}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Social Media */}
        <View style={[styles.card, { backgroundColor: colors.card, gap: 14 }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t("social_media")}</Text>
          {SOCIAL.map((field) => (
            <View key={field.label}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{field.label}</Text>
              <View style={[styles.inputGroup, { borderColor: colors.border }]}>
                <Feather name={field.icon} size={16} color={colors.mutedForeground} />
                <TextInput
                  value={field.value}
                  onChangeText={field.set}
                  style={[styles.input, { color: colors.foreground }]}
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="none"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Save */}
        <Pressable onPress={handleSave} disabled={saving} style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 }]}>
          <Feather name="save" size={18} color="#fff" />
          <Text style={styles.saveBtnText}>{saving ? t("saving") : t("save_changes")}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold" },
  card: { borderRadius: 16, padding: 16 },
  cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 8 },
  toggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  toggleInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  toggleIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  toggleLabel: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  toggleSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 6 },
  inputGroup: { flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, paddingBottom: 8 },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", padding: 0 },
  coverPicker: { position: "relative", borderRadius: 12, overflow: "hidden", height: 160 },
  coverImage: { width: "100%", height: 160, borderRadius: 12 },
  coverPlaceholder: { width: "100%", height: 160, borderRadius: 12, alignItems: "center", justifyContent: "center", gap: 8 },
  changePhotoText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  changePhotoOverlay: { position: "absolute", bottom: 10, right: 10, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  changePhotoOverlayText: { color: "#fff", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  logoPicker: { flexDirection: "row", alignItems: "center", gap: 14 },
  logoImage: { width: 64, height: 64, borderRadius: 16 },
  logoPlaceholder: { width: 64, height: 64, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  logoLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  logoSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  saveBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
});
