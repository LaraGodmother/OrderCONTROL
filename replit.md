# OrderControl

App mobile de pedidos para restaurante com painel administrativo. Clientes fazem pedidos, acompanham status e conversam com o restaurante. Admins gerenciam pedidos, produtos, promoções e configuram o restaurante.

## Run & Operate

- `pnpm --filter @workspace/ordercontrol run dev` — rodar o app Expo (porta 23815)
- `pnpm run typecheck` — typecheck completo
- Para gerar APK: `eas build -p android` (requer EAS CLI e conta Expo)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo 54 + Expo Router 6 (file-based routing)
- State: React Context + AsyncStorage (100% offline, sem backend ainda)
- UI: React Native + @expo/vector-icons + expo-linear-gradient
- Imagens: expo-image-picker

## Where things live

```
artifacts/ordercontrol/
├── app/
│   ├── (tabs)/          # 6 abas: index, menu, cart, orders, chat, profile
│   ├── admin/           # Painel admin: index, orders, products, categories, promotions, reports, settings, chat
│   ├── auth/            # login, register
│   ├── product/[id]     # Detalhe do produto
│   ├── order/[id]       # Acompanhamento do pedido
│   ├── checkout.tsx     # Finalizar pedido
│   ├── privacy-policy.tsx  # Política de privacidade (LGPD + GDPR)
│   └── chat.tsx         # Rota alternativa de chat
├── context/
│   ├── AuthContext.tsx        # Autenticação (admin/cliente)
│   ├── CartContext.tsx        # Carrinho de compras
│   ├── OrderContext.tsx       # Pedidos
│   ├── ChatContext.tsx        # Chat admin ↔ cliente (AsyncStorage)
│   ├── RestaurantContext.tsx  # Config dinâmica do restaurante (AsyncStorage)
│   └── LangContext.tsx        # 5 idiomas: pt-BR, pt-PT, en, es, fr + formatCurrency
├── components/          # Button, ProductCard, OrderStatusBadge, WhatsAppButton, ErrorBoundary
├── constants/
│   ├── colors.ts        # Paleta: primary #D4A017 (amarelo mostarda), secondary #1A1A1A (preto)
│   └── tenant.ts        # Configuração multi-tenant (TENANT_ID por restaurante)
├── data/restaurant.ts   # Dados padrão do restaurante + categorias + produtos
└── hooks/useColors.ts   # Hook de cores
```

## Funcionalidades

**Cliente:**
- Tela inicial com barra de idiomas no topo (🇧🇷🇵🇹🇺🇸🇪🇸🇫🇷)
- Destaques, categorias e listagem de produtos
- Cardápio com busca e filtro por categoria (FlatList, sem bug de layout)
- Carrinho com controle de quantidade
- Checkout com entrega/retirada, forma de pagamento
- Histórico de pedidos com acompanhamento em tempo real
- Chat com suporte do restaurante
- Perfil editável, troca de idioma (PT-BR/PT-PT/EN/ES/FR), logout
- Link para Política de Privacidade no perfil

**Admin:**
- Dashboard com métricas (pedidos, receita, ativos)
- Gerenciar pedidos (aceitar, preparar, enviar, entregar)
- Chat com clientes (vê todas as conversas)
- Produtos, categorias, promoções
- Configurações: nome, slogan, contatos, redes sociais, taxa de entrega, horário, **upload de logo e foto de capa**
- Relatórios

## Credenciais de teste

- Admin: `admin@ordercontrol.com` / `admin123`
- Cliente: qualquer e-mail + qualquer senha

## Design

- **Cor primária:** Amarelo mostarda `#D4A017`
- **Cor secundária / header:** Preto `#1A1A1A`
- **Background:** Branco `#FFFFFF`
- **Estilo:** Clean, cards, ícones Feather
- **Texto do botão primário:** Preto (contraste com amarelo)

## Idiomas e Moedas

| Idioma | Símbolo | Formato |
|--------|---------|---------|
| pt-BR | R$ | R$ 28,90 |
| pt-PT | € | 28,90 € |
| en | $ | $28.90 |
| es | $ | $28,90 |
| fr | € | 28,90 € |

Usar `formatCurrency(amount)` do `useLang()` para formatar preços em todo o app.

## Multi-Tenant (Google Play)

### Modo Atual: White-Label
Cada restaurante gera seu próprio APK com `TENANT_ID` único em `constants/tenant.ts`. Os dados ficam isolados por `TENANT_ID` no AsyncStorage.

```bash
# Para publicar para o Restaurante X:
# 1. Em app.json: { "extra": { "tenantId": "restaurante_x_123" } }
# 2. eas build -p android
```

### Modo SaaS: Multi-Tenant Real (futuro)
Para um único APK servir múltiplos restaurantes:
1. Backend Railway com autenticação JWT contendo `tenantId`
2. Banco Neon com schema isolado por restaurante
3. Clientes do Restaurante X só veem dados do X, Y só vê Y
4. Admin autenticado só acessa seu restaurante

## Preparação para APK / Neon + Railway

Para conectar backend real:
1. Criar banco PostgreSQL no **Neon** → obter `DATABASE_URL`
2. Deploy da API Express no **Railway** → obter URL base da API
3. Substituir os Contexts (AuthContext, OrderContext) por chamadas à API real
4. Para APK: instalar EAS CLI → `eas build -p android`
5. Configurar `app.json` com `android.package` (ex: `com.seurestaurante.ordercontrol`)

## Política de Privacidade

- Tela completa em `/privacy-policy` acessível pelo Perfil
- Cobre 10 seções: dados coletados, uso, segurança, direitos LGPD/GDPR, cookies, compartilhamento, menores, alterações, contato/DPO, base legal
- **Apto para Google Play e App Store**

## Architecture decisions

- Toda a persistência usa AsyncStorage com prefixo `@ordercontrol_{tenantId}_{key}` (isolamento multi-tenant)
- Expo Router com file-based routing — sem configuração manual de navegação
- RestaurantContext permite customizar o restaurante sem mudar código
- ChatContext isola a lógica de chat — pode ser substituída por WebSocket/Firebase
- LangContext inclui `formatCurrency(amount)` — preços formatados por locale
- Cardápio usa FlatList em vez de ScrollView aninhado (fix do bug de layout)

## User preferences

- App em português por padrão (pt-BR), suporte a pt-PT, EN, ES, FR
- Cor primária: amarelo mostarda #D4A017
- Cor secundária / header: preto #1A1A1A
- Estilo: moderno, clean, cards, ícones Feather

## Gotchas

- Upload de imagem (logo/capa) só funciona no app nativo (não no web preview)
- Para gerar APK real, precisa de conta Expo + EAS + `app.json` configurado
- O app usa `--localhost` no Metro, então o QR code só funciona na mesma rede
- `formatCurrency` não faz conversão real de moeda (sem API de câmbio) — usa formatação de locale com símbolo da moeda
