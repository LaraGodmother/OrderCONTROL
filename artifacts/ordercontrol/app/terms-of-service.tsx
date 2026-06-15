import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const SECTIONS = [
  {
    title: "1. Aceitação dos Termos",
    content:
      "Ao baixar, instalar ou usar o aplicativo OrderControl, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se não concordar com qualquer parte destes termos, não deverá usar o aplicativo.",
  },
  {
    title: "2. Descrição do Serviço",
    content:
      "O OrderControl é uma plataforma de pedidos online que conecta clientes a restaurantes. Através do app, você pode:\n\n• Navegar no cardápio do restaurante\n• Realizar pedidos de entrega ou retirada\n• Acompanhar o status do seu pedido em tempo real\n• Comunicar-se com o restaurante via chat\n• Gerenciar seu perfil e histórico de pedidos",
  },
  {
    title: "3. Cadastro e Conta",
    content:
      "Para usar o serviço, você deve:\n\n• Fornecer informações precisas e verdadeiras no cadastro\n• Manter a confidencialidade da sua senha\n• Notificar imediatamente qualquer acesso não autorizado à sua conta\n• Ser maior de 13 anos de idade\n\nVocê é responsável por todas as atividades realizadas em sua conta.",
  },
  {
    title: "4. Pedidos e Pagamentos",
    content:
      "Os pedidos realizados pelo app são enviados diretamente ao restaurante. O OrderControl atua como plataforma intermediária:\n\n• Os preços exibidos são definidos pelo restaurante\n• Pagamentos podem ser feitos via PIX, dinheiro, cartão ou na entrega\n• Pedidos confirmados estão sujeitos às políticas de cancelamento do restaurante\n• Taxa de entrega é definida pelo restaurante",
  },
  {
    title: "5. Uso Aceitável",
    content:
      "Você concorda em não:\n\n• Usar o app para fins ilegais ou não autorizados\n• Realizar pedidos fraudulentos ou com dados falsos\n• Tentar acessar áreas restritas do sistema\n• Interferir no funcionamento normal do serviço\n• Enviar conteúdo ofensivo, spam ou mensagens inadequadas no chat",
  },
  {
    title: "6. Propriedade Intelectual",
    content:
      "O OrderControl e todo seu conteúdo (textos, imagens, logotipos, design, código-fonte) são protegidos por direitos autorais e outras leis de propriedade intelectual. É proibida a reprodução, modificação ou distribuição sem autorização prévia e expressa.",
  },
  {
    title: "7. Limitação de Responsabilidade",
    content:
      "O OrderControl não se responsabiliza por:\n\n• Atrasos na entrega causados pelo restaurante\n• Qualidade dos produtos fornecidos pelo restaurante\n• Danos indiretos, incidentais ou consequenciais\n• Interrupções temporárias do serviço por manutenção ou problemas técnicos\n\nNossa responsabilidade total é limitada ao valor pago pelo pedido em questão.",
  },
  {
    title: "8. Cancelamento e Rescisão",
    content:
      "Você pode encerrar sua conta a qualquer momento, solicitando a exclusão pelo chat do app. Nos reservamos o direito de suspender ou encerrar contas que violem estes Termos de Uso, sem aviso prévio.",
  },
  {
    title: "9. Alterações nos Termos",
    content:
      "Podemos modificar estes Termos periodicamente. Notificaremos alterações significativas via notificação no app. O uso continuado após as alterações constitui aceitação dos novos termos.",
  },
  {
    title: "10. Lei Aplicável e Foro",
    content:
      "Estes Termos são regidos pela legislação brasileira. Qualquer disputa será resolvida pelo foro da comarca de São Paulo, SP, Brasil, com renúncia a qualquer outro, por mais privilegiado que seja.",
  },
  {
    title: "11. Contato",
    content:
      "Para dúvidas sobre estes Termos de Uso:\n\n• Via chat do aplicativo\n• E-mail: suporte@ordercontrol.app\n• Respondemos em até 5 dias úteis.",
  },
];

export default function TermsOfServiceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Termos de Uso</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, { backgroundColor: colors.accent }]}>
          <Feather name="file-text" size={24} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { color: colors.foreground }]}>Termos de Uso do Serviço</Text>
            <Text style={[styles.bannerSub, { color: colors.mutedForeground }]}>
              Leia atentamente antes de usar o app
            </Text>
          </View>
        </View>

        <Text style={[styles.lastUpdated, { color: colors.mutedForeground }]}>
          Última atualização: Janeiro de 2025
        </Text>

        <Text style={[styles.intro, { color: colors.mutedForeground }]}>
          Estes Termos de Uso regulam o acesso e uso do aplicativo OrderControl. Ao utilizar o app, você concorda com todos os termos descritos abaixo.
        </Text>

        {SECTIONS.map((section) => (
          <View key={section.title} style={[styles.section, { borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{section.title}</Text>
            <Text style={[styles.sectionContent, { color: colors.mutedForeground }]}>{section.content}</Text>
          </View>
        ))}

        <View style={[styles.footer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="check-circle" size={18} color={colors.success} />
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            Ao usar o OrderControl, você confirma que leu, compreendeu e concorda com estes Termos de Uso e com nossa Política de Privacidade.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold" },
  banner: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, marginBottom: 12 },
  bannerTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  bannerSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  lastUpdated: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 12 },
  intro: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, marginBottom: 20 },
  section: { borderTopWidth: 1, paddingTop: 20, marginBottom: 4, paddingBottom: 16 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 10 },
  sectionContent: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  footer: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 16 },
  footerText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
});
