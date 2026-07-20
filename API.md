# REST API & WebSocket Event Specification

## Interactive Swagger UI Documentation

Access live interactive OpenAPI documentation at: `http://localhost:5000/api-docs`

---

## Core Endpoint Catalog

### Bot Connection Management
- `POST /api/bot/connect` — Authenticate and connect Discord bot token.
- `POST /api/bot/disconnect` — Gracefully disconnect Discord client.
- `GET /api/bot/status` — Get bot status, uptime, ping & telemetry metrics.

### Observability & System Health
- `GET /api/health` — Full system health check (API, Database, Redis, Gateway).
- `GET /api/ready` — Readiness probe for Kubernetes/Docker.
- `GET /api/live` — Liveness probe for Kubernetes/Docker.
- `GET /api/metrics` — Prometheus metrics exporter format text.
- `GET /api/errors` — Exception stack trace log history.

### Guilds & Server Telemetry
- `GET /api/guilds` — List connected Discord guilds with owner IDs & channels.
- `GET /api/guilds/:id` — Detailed guild statistics, roles, emojis & stickers.

### Slash Commands
- `GET /api/commands` — List auto-detected slash commands & telemetry counts.
- `POST /api/commands/config` — Enable/disable slash command execution.

### User Management & RBAC
- `GET /api/users` — List dashboard users and assigned roles.
- `POST /api/users/invite` — Invite new user with specified role.
- `PATCH /api/users/:id/role` — Update user role permissions.

### Webhooks & API Keys
- `GET /api/webhooks` — List outgoing webhook integrations.
- `POST /api/webhooks` — Register new outgoing webhook subscriber.
- `GET /api/apikeys` — List active programmatic API keys.
- `POST /api/apikeys` — Generate new API access token.

### Data Export & Backup
- `GET /api/export` — Multi-format dataset export (JSON, CSV).
- `GET /api/backup/export` — Export non-secret backup JSON.
- `POST /api/backup/import` — Import and restore configuration backup JSON.

---

## Real-Time Socket.IO Pipeline

Socket.IO Server URL: `http://localhost:5000`

### Emitted Events:
- `bot:connected` — Fired when Discord bot reaches READY state.
- `telemetry:metrics` — Broadcast every 10s with CPU, RAM, Ping, Event throughput.
- `discord:event` — Broadcast for 20+ Gateway events (`ready`, `guildCreate`, `interactionCreate`, `messageUpdate`, etc.).
