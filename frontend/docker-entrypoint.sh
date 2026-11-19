#!/bin/sh
set -e

CERT_DIR="/etc/letsencrypt/live/orbivision.com"
CERT_FILE="$CERT_DIR/fullchain.pem"
KEY_FILE="$CERT_DIR/privkey.pem"

if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
    echo "⚠️  Let's Encrypt certificates not found at $CERT_DIR."
    echo "   Generating temporary self-signed SSL certificates for initial boot..."
    mkdir -p "$CERT_DIR"
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout "$KEY_FILE" \
        -out "$CERT_FILE" \
        -subj "/CN=orbivision.com" >/dev/null 2>&1
    echo "✅ Temporary SSL certificate generated. Nginx can now start on port 443."
fi

exec "$@"
