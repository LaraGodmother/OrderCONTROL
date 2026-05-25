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
import { useCart } from "@/context/CartContext";
import { useOrders, DeliveryType, PaymentMethod } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { RESTAURANT } from "@/data/restaurant";

const PAYMENT_OPTIONS: { key: PaymentMethod; label: string; icon: string }[] = [
  { key: "pix", label: "PIX", icon: "zap" },
  { key: "cash", label: "Dinheiro", icon: "dollar-sign" },
  { key: "credit_card", label: "Cartão de Crédito", icon: "credit-card" },
  { key: "pay_on_delivery", label: "Pagar na Entrega", icon: "truck" },
];

export default function CheckoutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const { items, total, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [address, setAddress] = useState(user?.address ?? "");
  const [neighborhood, setNeighborhood] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);

  const deliveryFee = deliveryType === "delivery" ? RESTAURANT.deliveryFee : 0;
  const grandTotal = total + deliveryFee;

  async function handleOrder() {
    if (!user) {
      Alert.alert("", "Faça login para continuar");
      router.push("/auth/login");
      return;
    }
    if (deliveryType === "delivery" && !address) {
      Alert.alert(t("error"), "Informe o endereço de entrega");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const order = createOrder({
      customerId: user.id,
      customerName: user.name,
      items: items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity, extras: i.extras })),
      paymentMethod,
      deliveryType,
      address: deliveryType === "delivery" ? address : undefined,
      neighborhood: deliveryType === "delivery" ? neighborhood : undefined,
      reference: deliveryType === "delivery" ? reference : undefined,
      subtotal: total,
      deliveryFee,
      total: grandTotal,
      estimatedTime: RESTAURANT.estimatedTime,
    });
    clearCart();
    setLoading(false);
    router.replace({ pathname: "/order/[id]", params: { id: order.id } });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad + 100 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground }]}>Finalizar Pedido</Text>
        </View>

        <View style={{ padding: 16, gap: 20 }}>
          {/* Delivery type */}
          <View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Tipo de entrega</Text>
            <View style={[styles.toggle, { backgroundColor: colors.card }]}>
              {(["delivery", "pickup"] as const).map((type) => (
                <Pressable key={type} onPress={() => setDeliveryType(type)} style={[styles.toggleBtn, { backgroundColor: deliveryType === type ? colors.primary : "transparent" }]}>
                  <Feather name={type === "delivery" ? "truck" : "shopping-bag"} size={16} color={deliveryType === type ? "#fff" : colors.mutedForeground} />
                  <Text style={{ color: deliveryType === type ? "#fff" : colors.mutedForeground, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
                    {type === "delivery" ? t("delivery") : t("pickup")}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Address fields */}
          {deliveryType === "delivery" && (
            <View style={styles.fieldsSection}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Endereço de entrega</Text>
              {[
                { label: t("address"), value: address, set: setAddress, icon: "map-pin" },
                { label: t("neighborhood"), value: neighborhood, set: setNeighborhood, icon: "map" },
                { label: t("reference"), value: reference, set: setReference, icon: "info" },
              ].map(({ label, value, set, icon }) => (
                <View key={label} style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Feather name={icon as any} size={16} color={colors.mutedForeground} />
                  <TextInput value={value} onChangeText={set} placeholder={label} placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground }]} />
                </View>
              ))}
            </View>
          )}

          {/* Payment */}
          <View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("payment_method")}</Text>
            <View style={styles.paymentList}>
              {PAYMENT_OPTIONS.map((opt) => (
                <Pressable key={opt.key} onPress={() => setPaymentMethod(opt.key)} style={[styles.paymentOption, { backgroundColor: paymentMethod === opt.key ? colors.accent : colors.card, borderColor: paymentMethod === opt.key ? colors.primary : colors.border, borderWidth: paymentMethod === opt.key ? 1.5 : 1 }]}>
                  <Feather name={opt.icon as any} size={20} color={paymentMethod === opt.key ? colors.primary : colors.mutedForeground} />
                  <Text style={{ color: paymentMethod === opt.key ? colors.primary : colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 14, flex: 1 }}>{opt.label}</Text>
                  {paymentMethod === opt.key && <Feather name="check-circle" size={18} color={colors.primary} />}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Summary */}
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Resumo do pedido</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.summaryRow}>
                <Text style={[styles.summaryItem, { color: colors.foreground }]}>{item.quantity}x {item.name}</Text>
                <Text style={[styles.summaryPrice, { color: colors.foreground }]}>R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</Text>
              </View>
            ))}
            <View style={[styles.divider, { borderTopColor: colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{t("subtotal")}</Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>R$ {total.toFixed(2).replace(".", ",")}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{t("delivery_fee")}</Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>{deliveryFee === 0 ? "Grátis" : `R$ ${deliveryFee.toFixed(2).replace(".", ",")}`}</Text>
            </View>
            <View style={[styles.summaryRow, { marginTop: 8 }]}>
              <Text style={[styles.totalLabel, { color: colors.foreground }]}>{t("total")}</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>R$ {grandTotal.toFixed(2).replace(".", ",")}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottomPad + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Pressable onPress={handleOrder} disabled={loading} style={({ pressed }) => [styles.orderBtn, { backgroundColor: colors.primary, opacity: pressed || loading ? 0.85 : 1 }]}>
          {!loading && <Feather name="check-circle" size={20} color="#fff" />}
          <Text style={styles.orderBtnText}>{loading ? "Processando..." : t("place_order")}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 14 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold" },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 12 },
  toggle: { flexDirection: "row", borderRadius: 14, padding: 4, gap: 4 },
  toggleBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 10, borderRadius: 10 },
  fieldsSection: { gap: 10 },
  inputGroup: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  input: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", padding: 0 },
  paymentList: { gap: 10 },
  paymentOption: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14 },
  summaryCard: { borderRadius: 16, padding: 16, gap: 8 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryItem: { fontSize: 13, fontFamily: "Inter_400Regular" },
  summaryPrice: { fontSize: 13, fontFamily: "Inter_500Medium" },
  summaryLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  summaryValue: { fontSize: 14, fontFamily: "Inter_500Medium" },
  totalLabel: { fontSize: 16, fontFamily: "Inter_700Bold" },
  totalValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  divider: { borderTopWidth: 1, marginVertical: 4 },
  footer: { padding: 16, borderTopWidth: 1 },
  orderBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14 },
  orderBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
});
