# Enterprise Production Deployment Guide

This document covers production deployment options for the **Discord Bot Control Center**.

---

## Option 1: Docker Compose (Recommended)

1. Ensure Docker & Docker Compose are installed.
2. Build and start containers:

```bash
docker-compose up -d --build
```

3. Access dashboard at `http://localhost:3000`.

---

## Option 2: Kubernetes Cluster (HA Deployment)

1. Apply secrets and deployment manifests:

```bash
kubectl create secret generic control-center-secrets \
  --from-literal=JWT_SECRET="your-jwt-secret" \
  --from-literal=ENCRYPTION_SECRET="your-32-byte-encryption-secret"

kubectl apply -f k8s/deployment.yaml
```

2. Check deployment status:

```bash
kubectl get pods -l app=discord-control-center
```

---

## Option 3: PM2 Process Manager

1. Install PM2 globally:

```bash
npm install -g pm2
```

2. Build production assets:

```bash
npm run build
```

3. Start process manager:

```bash
pm2 start ecosystem.config.js
```

---

## Option 4: Nginx Reverse Proxy Setup

Copy `nginx.conf` to `/etc/nginx/conf.d/control-center.conf` and restart Nginx:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/control-center
sudo ln -s /etc/nginx/sites-available/control-center /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
