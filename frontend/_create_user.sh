#!/bin/bash

# Crée un utilisateur administrateur par défaut
# Usage: ./create-admin.sh [base_url]
# Exemple: ./create-admin.sh http://localhost:3000

set -uo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

BASE_URL="${1:-http://localhost:3000}"

ADMIN_NAME="Administarteur"
ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASSWORD="admin123"   # 6 caractères minimum requis par le backend
ADMIN_ROLE="admin"

print_message() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

if ! command -v curl &> /dev/null; then
    print_error "curl est requis mais n'est pas installé."
    exit 1
fi

print_message "Création de l'admin ${ADMIN_EMAIL} sur ${BASE_URL}..."

response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/users" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"${ADMIN_NAME}\",
        \"email\": \"${ADMIN_EMAIL}\",
        \"password\": \"${ADMIN_PASSWORD}\",
        \"role\": \"${ADMIN_ROLE}\"
    }")

body=$(echo "$response" | sed '$d')
status=$(echo "$response" | tail -n1)

if [ "$status" = "201" ]; then
    print_message "Admin créé avec succès (HTTP 201)."
    echo "$body"
elif [ "$status" = "409" ]; then
    print_warning "Cet utilisateur existe déjà (HTTP 409) — rien à faire."
else
    print_error "Échec de la création (HTTP ${status})."
    echo -e "${YELLOW}${body}${NC}"
    exit 1
fi