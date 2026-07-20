# Security Architecture & Data Protection Policy

## Security Overview

The **Discord Bot Control Center** is built with strict enterprise security controls designed to guarantee zero sensitive credential exposure.

---

## Key Security Controls

1. **AES-256-GCM Credential Encryption**:
   - Bot Tokens and Client Secrets are encrypted at rest using Galois/Counter Mode (GCM).
   - Encryption secret MUST be a 32-character hexadecimal string (`ENCRYPTION_SECRET`).

2. **Secret Masking & Zero Leaks**:
   - Tokens and secrets are NEVER exposed in REST DTOs, logs, client bundles, or DevTools.
   - Credentials are masked via `maskSecret()` (`MTAx...U2Nw`).

3. **HTTP Header Protection (Helmet)**:
   - Express server enforces Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), X-Frame-Options DENY, and XSS Protection.

4. **Rate Limiting**:
   - Express rate limiters protect connection attempt endpoints against brute force attacks.

5. **Discord API Official Compliance**:
   - Purely official Discord REST API v10 and Discord.js v14 WebSocket client. Zero private or undocumented calls.

---

## Reporting Vulnerabilities

If you discover a security vulnerability, please email `security@controlcenter.io`.
