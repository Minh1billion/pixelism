#!/bin/bash
# ============================================================
# Nginx setup script for sprite-shop-pixelism
# Run with: sudo bash nginx-setup.sh
#
# Modes:
#   First-time setup  → installs nginx + certbot, issues SSL cert
#   Update config     → rewrites nginx config and reloads
# ============================================================

set -e

DOMAIN="pixelism.duckdns.org"
EMAIL="minh01212929979@@email.com"
FRONTEND_PORT=3000
BACKEND_PORT=8080

# ─────────────────────────────
# 1. Install nginx (idempotent)
# ─────────────────────────────
if ! command -v nginx &>/dev/null; then
  echo "[+] Installing Nginx..."
  apt update -y
  apt install nginx -y
else
  echo "[✓] Nginx already installed"
fi

# ─────────────────────────────
# 2. Write nginx config
# ─────────────────────────────
echo "[+] Writing Nginx config..."

rm -f /etc/nginx/sites-enabled/default

cat > /etc/nginx/sites-available/pixelism <<EOF
server {
    server_name ${DOMAIN};

    client_max_body_size 30M;

    # ── Next.js internal API routes ──────────────────────────
    # Phải đặt TRƯỚC location /api/ để không bị Spring Boot chặn
    location /api/config {
        proxy_pass http://localhost:${FRONTEND_PORT}/api/config;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # ── SSE — bypass Next.js, go directly to backend ─────────
    location /api/v1/sse/ {
        proxy_pass http://localhost:${BACKEND_PORT}/api/v1/sse/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffering off;
        proxy_cache off;
        proxy_set_header Connection '';
        proxy_http_version 1.1;
        chunked_transfer_encoding on;
        proxy_read_timeout 86400s;
    }

    # ── Backend API ───────────────────────────────────────────
    location /api/ {
        proxy_pass http://localhost:${BACKEND_PORT}/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffering off;
        proxy_cache off;
        proxy_set_header Connection '';
        proxy_http_version 1.1;
        chunked_transfer_encoding on;
    }

    # ── Actuator (health check) ───────────────────────────────
    location /actuator/ {
        proxy_pass http://localhost:${BACKEND_PORT}/actuator/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # ── OAuth2 authorization (click Google/GitHub button) ─────
    location /oauth2/ {
        proxy_pass http://localhost:${BACKEND_PORT}/oauth2/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # ── OAuth2 callback (Google/GitHub redirect) ──────────────
    location /login/oauth2/ {
        proxy_pass http://localhost:${BACKEND_PORT}/login/oauth2/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # ── Frontend ──────────────────────────────────────────────
    location / {
        proxy_pass http://localhost:${FRONTEND_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    server_name ${DOMAIN};
    return 308 https://\$host\$request_uri;
}
EOF

ln -sf /etc/nginx/sites-available/pixelism /etc/nginx/sites-enabled/

# ─────────────────────────────
# 3. SSL
# ─────────────────────────────
CERT_PATH="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"

if [ ! -f "$CERT_PATH" ]; then
  echo "[+] SSL cert not found — issuing via Certbot..."

  if ! command -v certbot &>/dev/null; then
    apt install certbot python3-certbot-nginx -y
  fi

  cat > /etc/nginx/sites-available/pixelism-temp <<'TMPEOF'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER;
    location / { return 200 'ok'; }
}
TMPEOF
  sed -i "s/DOMAIN_PLACEHOLDER/${DOMAIN}/" /etc/nginx/sites-available/pixelism-temp
  ln -sf /etc/nginx/sites-available/pixelism-temp /etc/nginx/sites-enabled/pixelism-temp
  nginx -t && systemctl reload nginx

  certbot certonly --nginx -d "${DOMAIN}" --non-interactive --agree-tos -m "${EMAIL}"

  rm -f /etc/nginx/sites-enabled/pixelism-temp
  rm -f /etc/nginx/sites-available/pixelism-temp
else
  echo "[✓] SSL cert already exists — skipping Certbot"
fi

# ─────────────────────────────
# 4. Validate & reload
# ─────────────────────────────
echo "[+] Validating config..."
nginx -t

echo "[+] Reloading Nginx..."
systemctl reload nginx

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✓ Nginx setup complete"
echo "  Domain : https://${DOMAIN}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"