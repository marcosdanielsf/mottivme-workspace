<!-- README for WhatsApp ↔ GHL Gateway -->

# WhatsApp ↔ GHL Gateway

![Build Status](https://github.com/Adrian-nex/GHL-Whatsapp-qr-gateway/actions/workflows/ci.yml/badge.svg)

Puerta de enlace (gateway) para enviar/recibir mensajes de WhatsApp usando QR (Baileys) y conectarla con GHL.

**Resumen rápido**

- **Objetivo**: permitir integración bidireccional GHL ↔ WhatsApp con colas, persistencia de sesiones y un panel mínimo.
- **Stack**: Node.js 20+, TypeScript, Express, @whiskeysockets/baileys, BullMQ, Redis, Docker Compose.

**Hitos (MVP)**

- **H1 — Sesión QR estable**: conexión por QR con persistencia de `authState` para evitar reescan.
- **H2 — Envío/recepción con colas**: cola de envío (BullMQ) con rate-limit para texto/media.
- **H3 — Integración GHL**: endpoint outbound (GHL → Gateway → WhatsApp) y forwarding inbound (WhatsApp → Gateway → GHL).
- **H4 — Multi-instancia**: soporte para múltiples `instanceId` (ej. `wa-01`, `wa-02`) y estado por instancia.
- **H5 — Panel mínimo**: UI para ver instancias, QR y reconectar; embebible como Custom Menu Link en GHL.

**Contenido de este repositorio**

- `src/` : servidor y lógica (baileys, cola, api, infra)
- `frontend/` : panel mínimo (React + Vite)
- `data/sessions/` : sesiones de Baileys (montadas con `SESSION_DIR`)
- `docker-compose.yml` : levantar servicio (`api`, `worker`, `redis`)

**Quick start (desarrolladores)**
Recomendado: tener Docker + Docker Compose y Node 20.

1. Copia variables de entorno:

```powershell
cp .env.example .env
# Edita .env con los valores reales (GHL_INBOUND_URL, NGROK_BASE_URL, REDIS_URL)
```

<!-- README for WhatsApp ↔ GHL Gateway -->

# 🚀 WhatsApp ↔ GHL Gateway

[![CI](https://github.com/Adrian-nex/GHL-Whatsapp-qr-gateway/actions/workflows/ci.yml/badge.svg)](https://github.com/Adrian-nex/GHL-Whatsapp-qr-gateway/actions/workflows/ci.yml)

Puerta de enlace (gateway) para integrar WhatsApp (por QR) con GHL — envío y recepción confiable de mensajes usando colas, sesiones persistentes y un panel de gestión.

🎯 Objetivo: permitir a equipos enviar mensajes desde GHL a clientes por WhatsApp y recibir respuestas que vuelven a GHL, con control de flujo y soporte multi-instancia.

---

## 🧭 Hitos (MVP) — Resumen visual

- 🔵 **H1 — Sesión QR estable**
  - Conectar por QR y persistir `authState` para evitar reescanos tras reinicios.
- 🟢 **H2 — Envío/recepción con colas**
  - Cola (BullMQ) para envío en background con rate-limits diferenciados para texto y media.
- 🟡 **H3 — Integración GHL**
  - Endpoint para que GHL dispare envíos (outbound) y forwarding de mensajes entrantes a GHL (inbound).
- 🟠 **H4 — Multi-instancia**
  - Gestionar múltiples `instanceId` (ej. `wa-01`, `wa-02`) con estado `ONLINE/OFFLINE/RECONNECTING`.
- 🔴 **H5 — Panel mínimo**
  - UI para ver instancias, mostrar QR y forzar reconexión; embebible en GHL como Custom Menu Link.

---

## 📦 Estructura del repositorio

- `src/` — servidor y lógica principal (Baileys wrapper, colas, API).
- `frontend/` — panel mínimo (React + Vite).
- `data/sessions/` — sesiones por `instanceId` (montaje con `SESSION_DIR`).
- `docker-compose.yml` — orquesta `api`, `worker` y `redis`.
- `.env.example` — plantilla de variables de entorno.

---

## 🚀 Guía rápida — Arrancar localmente

Requisitos: Docker & Docker Compose (recomendado) o Node 20 + Redis local.

1. Copiar plantilla de entorno y editar valores sensibles:

```powershell
copy .env.example .env
# Edita .env: GHL_INBOUND_URL, NGROK_BASE_URL, REDIS_URL si aplica
```

2. Levantar con Docker (modo recomendado):

```powershell
docker-compose up --build
```

3. Desarrollo local sin Docker (requiere Redis corriendo):

```powershell
npm ci
npm run dev
```

4. Abrir panel (si frontend corriendo) en: `http://localhost:5173`

---

## 🧭 Variables importantes (.env)

Usa `.env.example` como guía. Variables clave:

- `PORT` — Puerto HTTP (ej. `8080`).
- `REDIS_URL` — `redis://redis:6379` (por defecto en docker-compose).
- `SESSION_DIR` — carpeta donde Baileys guarda `authState` (ej. `./data/sessions`).
- `TEXT_DELAY_MS` — ms entre mensajes de texto (ej. `3500`).
- `MEDIA_DELAY_MS_MIN` / `MEDIA_DELAY_MS_MAX` — rango para envíos de media (ej. `6000-9000`).
- `CORS_ORIGIN` — orígenes permitidos para el panel.
- `GHL_INBOUND_URL` — endpoint en GHL para recibir mensajes inbound.
- `NGROK_BASE_URL` — (opcional) URL base de ngrok para callbacks en desarrollo.

> Seguridad: NO subas tu `.env` a un repo público. Usa secretos en CI/CD.

---

## 🔌 Endpoints principales (resumen)

- `POST /api/instances` — Crear/Inicializar `instanceId` (body: `{ instanceId, phoneAlias?, forceNew? }`).
- `GET /api/instances` — Listar instancias y su estado.
- `GET /api/wa/qr/:instanceId` — Obtener QR (o iniciar su generación).
- `POST /api/wa/reconnect/:instanceId` — Forzar reconexión.
- `POST /api/send` — Encolar envío: `{ instanceId, to, type, message|mediaUrl }`.
- `POST /api/ghl/outbound` — Endpoint para GHL → Gateway → WhatsApp.
- `POST /api/ghl/inbound-test` — Endpoint mock para recibir inbounds desde el gateway (uso en pruebas).

Ejemplo rápido (PowerShell):

```powershell
curl -X POST http://localhost:8080/api/send `
  -H "Content-Type: application/json" `
  -d '{"instanceId":"wa-01","to":"+51999999999","type":"text","message":"Hola desde GHL"}'
```

---

## 🧭 Hitos — Documentación detallada y cómo comprobarlos

### H1 — Sesión QR estable 🔵

- Qué hace: permite escanear un QR una vez y mantener la sesión entre reinicios.
- Archivos clave: `src/core/baileys.ts`, `src/api/qr.controller.ts`.
- Cómo probar:
  1. `POST /api/instances` crear `wa-01` (si no existe).
  2. `GET /api/wa/qr/wa-01` — obtiene `qr` (base64) o estado conectado.
  3. Escanear con WhatsApp → revisar logs en `api` (aparecerá `connection.update` y `ONLINE`).
  4. Reiniciar contenedor/servicio → comprobar que NO pide reescan.

### H2 — Envío/recepción con colas 🟢

- Qué hace: mensajes encolados con BullMQ y enviados por `worker` respetando delays.
- Archivos clave: `src/core/queue.ts`, `src/api/send.controller.ts`, `src/core/queueMonitor.ts`, `src/core/baileys.ts` (send logic).
- Cómo probar:
  1. Encolar mensaje `POST /api/send`.
  2. Ver logs del worker: `[wa-01] SENT → +519... (text)`.
  3. Observar delays configurados por `TEXT_DELAY_MS` y `MEDIA_DELAY_MS_*`.

### H3 — Integración GHL 🟡

- Qué hace: GHL dispara `POST /api/ghl/outbound` → gateway encola y envía; inbound se reenvía a `GHL_INBOUND_URL`.
- Archivos clave: `src/api/ghl.controller.ts`, `src/core/baileys.ts` (sendInboundToGHL).
- Cómo probar:
  1. Configurar `GHL_INBOUND_URL` en `.env` o usar el mock `POST /api/ghl/inbound-test`.
  2. Desde GHL (o curl) llamar `POST /api/ghl/outbound` con `{ instanceId, to, message }`.
  3. Comprobar que el mensaje llega al teléfono y que el inbound (cliente responde) llega a `GHL_INBOUND_URL`.

### H4 — Multi-instancia 🟠

- Qué hace: permitir múltiples números (sesiones separadas) y exponer estado por instancia.
- Archivos clave: `src/core/baileys.ts` (instancesMetadata, activeSockets), `src/api/qr.controller.ts` (`POST /api/instances`, `GET /api/instances`).
- Cómo probar:
  1. `POST /api/instances` → `wa-01`, `wa-02`.
  2. Obtener QR de ambas y escanear con dos teléfonos distintos.
  3. Enviar mensajes con `instanceId` diferente y verificar que no se mezclan.
  4. `GET /api/instances` debe mostrar `ONLINE/RECONNECTING/OFFLINE` correctamente.

### H5 — Panel mínimo 🔴

- Qué hace: UI para listar instancias, ver QR y reconectar; pensada para embeber en GHL.
- Archivos clave: `frontend/` (React), `frontend/src/types/gateway.ts`, `frontend/src/styles`.
- Cómo probar:
  1. Levantar frontend (`npm run dev` en `frontend/` o servir estático).
  2. Abrir `http://localhost:5173` → ver lista de instancias.
  3. Usar botones: `Ver QR` y `Reconectar`.

---

## 🔎 Notas técnicas y recomendaciones

- Rate-limit actual: implementación en memoria por proceso. Si ejecutas varios `worker` en paralelo, mueve control a Redis para evitar colisiones.
- Seguridad: añade autenticación (API key o JWT) a endpoints sensibles (`/api/send`, `/api/ghl/*`, `/api/instances`).
- Robustez webhooks: implementar reintentos con backoff y DLQ para `GHL_INBOUND_URL`.
- Backups: realiza snapshots periódicos de `data/sessions` si usas discos persistentes.

---

## ✅ CI / CD

- Workflow de ejemplo: `.github/workflows/ci.yml` hace `npm ci`, `npm run build` y `npx tsc --noEmit`.
- Añade secretos en GitHub (`REDIS_URL`, `GHL_INBOUND_URL`) y un pipeline de despliegue si necesitas CD.

---

## 📌 FAQ rápido

- ¿Puedo usar el API sin Docker? Sí: debes tener Node 20 y un Redis accesible.
- ¿Qué pasa si el QR caduca? Borra la sesión (`POST /api/wa/clear/:instanceId`) y genera uno nuevo.
- ¿Cómo evitar que el número sea bloqueado por Meta? Sigue buenas prácticas: no enviar spam, respetar límites y monitorear alerts.

---
