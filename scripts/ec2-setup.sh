#!/bin/bash
# ============================================================
# EC2 first-time setup script
# Run with: sudo bash ec2-setup.sh
# ============================================================

set -e

echo "═══════════════════════════════════════"
echo "  EC2 Setup — sprite-shop-pixelism"
echo "═══════════════════════════════════════"

# ──────────────────────────────
# 1. Update system packages
# ──────────────────────────────
echo ""
echo "[1/5] Updating packages..."
apt-get update -y && apt-get upgrade -y

# ──────────────────────────────
# 2. Install Docker
# ──────────────────────────────
echo ""
echo "[2/5] Installing Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
  usermod -aG docker ubuntu
  systemctl enable docker
  systemctl start docker
  echo "Docker installed: $(docker --version)"
else
  echo "Docker already installed: $(docker --version)"
fi

# ──────────────────────────────
# 3. Install Git
# ──────────────────────────────
echo ""
echo "[3/5] Installing Git..."
apt-get install -y git
echo "Git: $(git --version)"

# ──────────────────────────────
# 4. Install utilities
# ──────────────────────────────
echo ""
echo "[4/5] Installing utilities..."
apt-get install -y \
  curl \
  wget \
  unzip \
  htop \
  jq

# ──────────────────────────────
# 5. Create app directory structure
# ──────────────────────────────
echo ""
echo "[5/5] Creating /app directory..."
mkdir -p /app/source
chown -R ubuntu:ubuntu /app
echo "/app directory is ready."

# ──────────────────────────────
# Done
# ──────────────────────────────
echo ""
echo "═══════════════════════════════════════"
echo "  Setup complete!"
echo ""
echo "  IMPORTANT: Log out and log back in"
echo "  for the docker group to take effect."
echo ""
echo "  Then trigger your first deploy:"
echo "  -> Push code to GitHub branch main"
echo "  -> GitHub Actions will deploy automatically"
echo "═══════════════════════════════════════"