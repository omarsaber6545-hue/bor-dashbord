# Installation & Quickstart Guide — Discord Bot Control Center

## Prerequisites

- **Node.js**: v18.0.0 or higher (v20 LTS or v24 supported)
- **npm**: v9.0.0 or higher
- **Git**
- **Discord Bot Token**: From [Discord Developer Portal](https://discord.com/developers/applications)

---

## 1. Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/your-org/discord-control-center.git
cd discord-control-center

# Install root, server and client dependencies
npm run install:all
```

---

## 2. Environment Configuration

Copy `.env.example` to `server/.env`:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your encryption secrets:

```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-jwt-key-change-in-production"
ENCRYPTION_SECRET="0123456789abcdef0123456789abcdef"
CLIENT_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 3. Database Initialization

Synchronize Prisma SQLite schema:

```bash
npm run prisma:push
```

---

## 4. Run Development Environment

Start both Express backend and Next.js frontend concurrently:

```bash
npm run dev
```

- **Frontend Dashboard**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000/api`
- **Swagger Open API Documentation**: `http://localhost:5000/api-docs`

---

## 5. Build for Production

```bash
npm run build
```
