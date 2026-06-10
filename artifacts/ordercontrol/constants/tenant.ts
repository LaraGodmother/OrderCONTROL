/**
 * CONFIGURAÇÃO MULTI-TENANT
 *
 * Para publicar no Google Play para múltiplos restaurantes:
 * 1. Defina um TENANT_ID único para cada restaurante
 * 2. Cada restaurante gera seu próprio APK com seu TENANT_ID
 * 3. Para multi-tenant real (um app, vários restaurantes), conecte ao Railway backend
 *
 * Como configurar:
 * - Defina EXPO_PUBLIC_TENANT_ID no app.json ou .env
 * - Exemplo app.json: { "extra": { "tenantId": "restaurante_joao_123" } }
 *
 * Com backend Railway + Neon:
 * - Cada tenant tem seu schema isolado no banco
 * - Autenticação JWT inclui tenantId
 * - Clientes só veem dados do restaurante onde se cadastraram
 */

import Constants from "expo-constants";

export const TENANT_ID: string =
  (Constants.expoConfig?.extra?.tenantId as string) ||
  process.env.EXPO_PUBLIC_TENANT_ID ||
  "default_restaurant";

/**
 * Retorna uma chave de AsyncStorage com o tenantId como prefixo.
 * Isso garante isolamento de dados entre restaurantes no mesmo dispositivo.
 */
export function tenantKey(key: string): string {
  return `@ordercontrol_${TENANT_ID}_${key}`;
}
