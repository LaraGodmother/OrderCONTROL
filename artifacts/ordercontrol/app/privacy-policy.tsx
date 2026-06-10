import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useLang } from "@/context/LangContext";

export default function PrivacyPolicyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const sections = [
    {
      title: "1. Informações que Coletamos",
      content:
        "Coletamos as seguintes informações quando você usa nosso aplicativo:\n\n• Nome completo e e-mail (para criar e gerenciar sua conta)\n• Número de telefone e endereço (para entrega de pedidos)\n• Histórico de pedidos (para melhorar sua experiência)\n• Mensagens de chat com o restaurante\n• Preferências de idioma\n\nNão coletamos dados de localização GPS, informações de cartão de crédito (pagamentos são confirmados presencialmente/na entrega) nem dados biométricos.",
    },
    {
      title: "2. Como Usamos suas Informações",
      content:
        "Utilizamos seus dados exclusivamente para:\n\n• Processar e entregar seus pedidos\n• Enviar atualizações sobre o status do seu pedido\n• Permitir comunicação com o restaurante via chat\n• Melhorar nossos serviços e experiência do usuário\n• Cumprir obrigações legais e fiscais\n\nNão vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing.",
    },
    {
      title: "3. Armazenamento e Segurança",
      content:
        "Seus dados são armazenados localmente no seu dispositivo usando tecnologia segura (AsyncStorage criptografado). Ao conectar a um servidor backend, os dados são transmitidos via HTTPS com criptografia TLS 1.2+.\n\nMantemos seus dados apenas pelo tempo necessário para fornecer o serviço ou conforme exigido por lei (até 5 anos para registros fiscais).",
    },
    {
      title: "4. Seus Direitos (LGPD / GDPR)",
      content:
        "Nos termos da Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e do Regulamento Geral de Proteção de Dados (GDPR), você tem direito a:\n\n• Acessar seus dados pessoais\n• Corrigir dados incorretos ou desatualizados\n• Solicitar a exclusão de seus dados\n• Revogar o consentimento a qualquer momento\n• Portabilidade dos seus dados\n• Saber com quem compartilhamos seus dados\n\nPara exercer esses direitos, entre em contato conosco pelo chat do aplicativo ou WhatsApp.",
    },
    {
      title: "5. Cookies e Tecnologias Similares",
      content:
        "Este aplicativo não utiliza cookies de rastreamento de terceiros. Utilizamos apenas armazenamento local para salvar preferências do usuário (como idioma selecionado) e dados de sessão necessários para o funcionamento do app.",
    },
    {
      title: "6. Compartilhamento de Dados",
      content:
        "Seus dados podem ser compartilhados com:\n\n• Serviços de hospedagem (para funcionamento do servidor)\n• Entregadores (apenas nome e endereço, exclusivamente para entrega)\n• Autoridades competentes (quando exigido por lei)\n\nNunca compartilhamos seus dados com empresas de publicidade ou redes sociais.",
    },
    {
      title: "7. Menores de Idade",
      content:
        "Nosso aplicativo é destinado a maiores de 13 anos. Não coletamos intencionalmente dados de crianças menores de 13 anos. Se você acredita que coletamos dados de um menor, entre em contato conosco imediatamente para exclusão.",
    },
    {
      title: "8. Alterações nesta Política",
      content:
        "Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças significativas via notificação no aplicativo. O uso continuado do app após as alterações constitui aceitação da nova política.",
    },
    {
      title: "9. Contato e DPO",
      content:
        "Para dúvidas sobre privacidade, exercício de direitos ou para entrar em contato com nosso Encarregado de Dados (DPO):\n\n• Via chat do aplicativo\n• Via WhatsApp do restaurante\n• E-mail: privacidade@ordercontrol.app\n\nResponderemos em até 15 dias úteis.",
    },
    {
      title: "10. Base Legal para Tratamento",
      content:
        "Tratamos seus dados com base nas seguintes hipóteses legais da LGPD:\n\n• Execução de contrato (processar seu pedido)\n• Legítimo interesse (melhorar o serviço)\n• Cumprimento de obrigação legal (registros fiscais)\n• Consentimento (comunicações de marketing, quando aplicável)",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 10, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Política de Privacidade</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, { backgroundColor: colors.accent }]}>
          <Feather name="shield" size={24} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { color: colors.foreground }]}>Sua privacidade importa</Text>
            <Text style={[styles.bannerSub, { color: colors.mutedForeground }]}>
              Conforme LGPD (Lei nº 13.709/2018) e GDPR
            </Text>
          </View>
        </View>

        <Text style={[styles.lastUpdated, { color: colors.mutedForeground }]}>
          Última atualização: Janeiro de 2025
        </Text>

        <Text style={[styles.intro, { color: colors.mutedForeground }]}>
          Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais quando você utiliza o aplicativo OrderControl. Ao usar o app, você concorda com os termos desta política.
        </Text>

        {sections.map((section) => (
          <View key={section.title} style={[styles.section, { borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{section.title}</Text>
            <Text style={[styles.sectionContent, { color: colors.mutedForeground }]}>{section.content}</Text>
          </View>
        ))}

        <View style={[styles.footer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="check-circle" size={18} color={colors.success} />
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            Este app está em conformidade com a LGPD brasileira e o GDPR europeu, adequado para publicação no Google Play e App Store.
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
