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
│   └── chat.tsx         # Rota alternativa de chat
├── context/
│   ├── AuthContext.tsx        # Autenticação (admin/cliente)
│   ├── CartContext.tsx        # Carrinho de compras
│   ├── OrderContext.tsx       # Pedidos
│   ├── ChatContext.tsx        # Chat admin ↔ cliente (AsyncStorage)
│   ├── RestaurantContext.tsx  # Config dinâmica do restaurante (AsyncStorage)
│   └── LangContext.tsx        # 4 idiomas: pt-BR, en, es, fr
├── components/          # Button, ProductCard, OrderStatusBadge, WhatsAppButton, ErrorBoundary
├── constants/colors.ts  # Paleta: primary #DC2626
├── data/restaurant.ts   # Dados padrão do restaurante + categorias + produtos
└── hooks/useColors.ts   # Hook de cores
```

## Funcionalidades

**Cliente:**
- Tela inicial com destaques, categorias e listagem de produtos
- Cardápio com busca e filtro por categoria
- Carrinho com controle de quantidade
- Checkout com entrega/retirada, forma de pagamento
- Histórico de pedidos com acompanhamento em tempo real
- Chat com suporte do restaurante
- Perfil editável, troca de idioma (PT/EN/ES/FR), logout

**Admin:**
- Dashboard com métricas (pedidos, receita, ativos)
- Gerenciar pedidos (aceitar, preparar, enviar, entregar)
- Chat com clientes (vê todas as conversas)
- Produtos, categorias, promoções
- Configurações do restaurante: nome, slogan, contatos, redes sociais, taxa de entrega, horário de abertura, **upload de logo e foto de capa**
- Relatórios

## Credenciais de teste

- Admin: `admin@ordercontrol.com` / `admin123`
- Cliente: qualquer e-mail + qualquer senha

## Preparação para APK / Neon + Railway

Para conectar backend real:
1. Criar banco PostgreSQL no **Neon** → obter `DATABASE_URL`
2. Deploy da API Express no **Railway** → obter URL base da API
3. Substituir os Contexts (AuthContext, OrderContext) por chamadas à API real
4. Para APK: instalar EAS CLI → `eas build -p android`
5. Configurar `app.json` com `android.package` (ex: `com.seurestaurante.ordercontrol`)

## Architecture decisions

- Toda a persistência usa AsyncStorage (offline-first) — fácil migrar para API real
- Expo Router com file-based routing — sem configuração manual de navegação
- RestaurantContext permite customizar o restaurante sem mudar código
- ChatContext isola a lógica de chat — pode ser substituída por WebSocket/Firebase
- Traduções cobertas em 100% das telas nas 4 línguas via LangContext

## User preferences

- App em português por padrão, suporte a EN, ES, FR
- Cor primária: vermelho #DC2626
- Estilo: moderno, cards, ícones Feather

## Gotchas

- Upload de imagem (logo/capa) só funciona no app nativo (não no web preview)
- Para gerar APK real, precisa de conta Expo + EAS + `app.json` configurado
- O app usa `--localhost` no Metro, então o QR code só funciona na mesma rede
