---
name: OrderControl App Configuration
description: Key config decisions for the OrderControl Expo multitenant restaurant ordering app
---

# OrderControl App Config

**Why:** Avoids repeating mistakes in future sessions.

## Workflow
- Command: `pnpm --filter @workspace/ordercontrol exec expo start --localhost --port 8081 --web`
- Port: **8081 fixed** — `$PORT` env var is NOT set by Replit workflow system, causes "option requires argument" error
- waitForPort: 8081 (maps to external port 80)

## App Identity
- Package: `com.ordercontrol.app`
- Bundle ID: `com.ordercontrol.app`
- Version: 1.0.0
- Icon: `./assets/images/icon.png` (1024x1024, AI-generated with fork+knife logo)
- Adaptive icon foreground: `./assets/images/adaptive-icon.png`
- Splash background: `#1A1A1A`

## Multitenant System
- Admin seeded on first launch via `seedDefaultAdmin()` in AuthContext
- Default admin: `admin@ordercontrol.com` / `admin123`, tenant `DEMO01`
- Customers register with 6-char tenant code from restaurant owner

## Colors
- Primary: `#F59E0B` (amber/yellow)
- Secondary/header: `#1A1A1A` (dark charcoal)
- Button primary text: `#000` (black on yellow)

## Legal Compliance (Google Play)
- Privacy Policy screen: `app/privacy-policy.tsx` (LGPD + GDPR compliant)
- Terms of Service screen: `app/terms-of-service.tsx`
- ConsentBanner: `components/ConsentBanner.tsx` — first-launch consent modal, persisted via AsyncStorage key `@ordercontrol_consent_v1`

## Translation
- `t()` falls back to pt-BR for missing keys in other languages
- Add new keys to pt-BR AND en blocks minimum
