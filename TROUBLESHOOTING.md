# Enterprise Troubleshooting & FAQ Guide

## Common Issues & Resolutions

### 1. `ERR_INVALID_PACKAGE_CONFIG` on Node.js v24

**Symptom**: `ts-node-dev` throws loader configuration error when running backend.  
**Resolution**: Run `npx tsc && node dist/index.js` or `npm run build:server` instead of `ts-node-dev`. The root `package.json` dev script has been updated to use compiled `tsc` execution automatically.

---

### 2. Message Content Intent Disabled Warning

**Symptom**: Dashboard shows amber warning badge: "Message Content Intent Disabled".  
**Resolution**:
1. Open [Discord Developer Portal](https://discord.com/developers/applications).
2. Select your Bot application -> **Bot** tab.
3. Scroll down to **Privileged Gateway Intents**.
4. Enable **Message Content Intent**.
5. Save changes and reconnect bot in dashboard.

---

### 3. Invalid Bot Token (Error 4004)

**Symptom**: Connection fails with "An invalid token was provided".  
**Resolution**: Verify that you copied the complete Bot Token without trailing spaces or quotes. Check that the bot has not been reset in Developer Portal.

---

### 4. Database Table Missing / SQLite Migration Error

**Symptom**: Prisma throws database table not found error.  
**Resolution**:
```bash
npm run prisma:push
```
This automatically synchronizes the SQLite schema in `server/prisma/dev.db`.
