# Discord Bot Control Center 🚀

An enterprise-grade, secure, production-ready Discord Bot Control Center dashboard built with **Next.js 14**, **Node.js/Express**, **Discord.js v14**, **Socket.IO**, **Prisma ORM**, and **AES-256-GCM Encryption**.

---

## 🌟 Key Features & Highlights

- **100% Discord API & Discord.js v14 Compliance**: Relies strictly on official Discord REST, Gateway, and OAuth2 endpoints.
- **Bot Token ONLY Authentication**: Authenticates bots using ONLY the Bot Token. Client ID is automatically retrieved upon login. Client Secret is optional for web OAuth login.
- **AES-256-GCM Dynamic Encryption**: Bot Tokens and Client Secrets are encrypted prior to database storage and never exposed in REST/Socket payloads or client bundles.
- **Internal Telemetry Engine**: Tracks Slash Command execution counts, duration, success/failure rate, and timestamp histories without violating Discord API boundaries.
- **Real-Time Gateway Event Pipeline**: Socket.IO streams 20+ Discord events (`ready`, `interactionCreate`, `guildCreate`, `guildDelete`, `messageUpdate`, `warn`, `error`, etc.).
- **VSCode Live Console**: Color-coded monospace terminal UI streaming live logs with search, level filters (`INFO`, `WARN`, `ERROR`, `DEBUG`), and JSON/TXT export.
- **Interactive OAuth2 Invite Generator**: Selectable Discord permission bitfields and scopes with live URL calculation.
- **Graceful Intent & Permission Badges**: Badges like `Intent Disabled` and `Permission Required` provide immediate feedback without crashing runtime execution.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Lucide Icons, Framer Motion, Recharts.
- **Backend**: Node.js, Express, TypeScript, Discord.js v14, Socket.IO, Prisma ORM, Helmet, CORS, Rate Limiting.
- **Security**: AES-256-GCM Encryption, JWT Authentication, Zod Validation, HTTPOnly Cookies.

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js >= 20.x
- npm >= 9.x

### 2. Install Dependencies & Generate Database
```bash
# Install root dependencies
npm install

# Install server dependencies & push Prisma schema
cd server
npm install
npx prisma generate
npx prisma db push

# Install client dependencies
cd ../client
npm install
```

### 3. Running Locally in Development Mode
```bash
# From root directory:
npm run dev
```

- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Swagger Documentation**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## 🔒 Security Principles

1. **Token Protection**: Bot Tokens are encrypted with AES-256-GCM and stored safely. They are never rendered in plain text in any frontend state or API response.
2. **Security Headers**: Helmet sets Content Security Policy (CSP), XSS protection, and frameguard options.
3. **Observability**: Health endpoints (`/api/health`, `/api/ready`, `/api/live`) ensure automated liveness checks for container orchestration.
