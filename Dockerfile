# Production Multi-Stage Dockerfile for Discord Bot Control Center

# Stage 1: Backend Build
FROM node:20-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
COPY server/prisma ./prisma/
RUN npm ci
COPY server/ ./
RUN npx prisma generate
RUN npm run build

# Stage 2: Frontend Build
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
ENV NEXT_PUBLIC_API_URL=http://localhost:5000/api
ENV NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
RUN npm run build

# Stage 3: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=server-builder /app/server/package*.json ./server/
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/prisma ./server/prisma
COPY --from=server-builder /app/server/node_modules ./server/node_modules

COPY --from=client-builder /app/client/package*.json ./client/
COPY --from=client-builder /app/client/.next ./client/.next
COPY --from=client-builder /app/client/public ./client/public
COPY --from=client-builder /app/client/node_modules ./client/node_modules

COPY package.json ./
RUN npm install -g concurrently

EXPOSE 5000 3000

CMD ["concurrently", "node server/dist/index.js", "npm --prefix client start"]
