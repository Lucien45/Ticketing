#!/bin/bash

# Script de test du backend - Projet Ticketing
# Usage: ./test-backend.sh [base_url]
# Exemple: ./test-backend.sh http://localhost:3000

set -uo pipefail

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="Ticketing"
BASE_URL="${1:-http://localhost:3000}"
TIMESTAMP=$(date +%s)
TEST_EMAIL="test.${TIMESTAMP}@example.com"
TEST_PASSWORD="Password123"

PASS_COUNT=0
FAIL_COUNT=0

# IMPORTANT : tous les messages de log doivent aller sur stderr (>&2).
# Sinon, un appel du style `body=$(assert_status ...)` capture aussi ces
# lignes (couleur ANSI comprise) en plus du JSON, et jq reçoit alors une
# entrée invalide -> "jq: parse error: Invalid numeric literal ...".
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1" >&2
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" >&2
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

print_header() {
    echo -e "${BLUE}================================${NC}" >&2
    echo -e "${BLUE}  Projet ${PROJECT_NAME} ${NC}" >&2
    echo -e "${BLUE}  Cible: ${BASE_URL} ${NC}" >&2
    echo -e "${BLUE}================================${NC}" >&2
}

check_dependencies() {
    if ! command -v curl &> /dev/null; then
        print_error "curl est requis mais n'est pas installé."
        exit 1
    fi
    if ! command -v jq &> /dev/null; then
        print_error "jq est requis mais n'est pas installé (sudo apt install jq)."
        exit 1
    fi
}

# Effectue un appel HTTP et retourne "corps\ncode_http" via stdout
call_api() {
    local method=$1
    local endpoint=$2
    local data=${3:-}
    local token=${4:-}
    local headers=(-H "Content-Type: application/json")

    if [ -n "$token" ]; then
        headers+=(-H "Authorization: Bearer $token")
    fi

    if [ -n "$data" ]; then
        curl -s -w "\n%{http_code}" -X "$method" "${BASE_URL}${endpoint}" \
            "${headers[@]}" -d "$data"
    else
        curl -s -w "\n%{http_code}" -X "$method" "${BASE_URL}${endpoint}" \
            "${headers[@]}"
    fi
}

# Vérifie le code HTTP, log le résultat (sur stderr) et renvoie UNIQUEMENT
# le corps de la réponse sur stdout, pour rester utilisable via
# `body=$(assert_status ...)` sans pollution.
assert_status() {
    local description=$1
    local expected=$2
    local response=$3

    local body
    local status
    body=$(echo "$response" | sed '$d')
    status=$(echo "$response" | tail -n1)

    if [ "$status" = "$expected" ]; then
        print_message "PASS - ${description} (HTTP ${status})"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        print_error "FAIL - ${description} (attendu ${expected}, reçu ${status})"
        echo -e "${YELLOW}       Réponse: ${body}${NC}" >&2
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi

    echo "$body"
}

run_tests() {
    local response body

    # --- 1. Inscription ---
    response=$(call_api "POST" "/users" \
        "{\"name\":\"Test User\",\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}")
    body=$(assert_status "Inscription d'un nouvel utilisateur" "201" "$response")
    USER_ID=$(echo "$body" | jq -r '.id // empty' 2>/dev/null)

    # --- 2. Email déjà utilisé -> conflit ---
    response=$(call_api "POST" "/users" \
        "{\"name\":\"Test User\",\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}")
    assert_status "Rejet d'un email déjà utilisé" "409" "$response" > /dev/null

    # --- 3. Login avec mauvais mot de passe ---
    response=$(call_api "POST" "/users/login" \
        "{\"email\":\"${TEST_EMAIL}\",\"password\":\"wrongpassword\"}")
    assert_status "Rejet d'un mauvais mot de passe" "401" "$response" > /dev/null

    # --- 4. Login valide ---
    response=$(call_api "POST" "/users/login" \
        "{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}")
    body=$(assert_status "Connexion avec identifiants valides" "200" "$response")
    TOKEN=$(echo "$body" | jq -r '.access_token // empty' 2>/dev/null)

    if [ -z "$TOKEN" ]; then
        print_error "Impossible de récupérer un token, arrêt des tests suivants."
        return
    fi

    # --- 5. Accès protégé sans token ---
    response=$(call_api "GET" "/ticket")
    assert_status "Refus d'accès sans token (GET /tickets)" "401" "$response" > /dev/null

    # --- 6. Accès protégé avec token ---
    response=$(call_api "GET" "/users" "" "$TOKEN")
    assert_status "Liste des utilisateurs avec token" "200" "$response" > /dev/null

    # --- 7. Création d'un ticket ---
    response=$(call_api "POST" "/ticket" \
        "{\"title\":\"Test ticket\",\"description\":\"Créé par le script de test\",\"userId\":\"${USER_ID}\"}" "$TOKEN")
    body=$(assert_status "Création d'un ticket" "201" "$response")
    TICKET_ID=$(echo "$body" | jq -r '.id // empty' 2>/dev/null)

    if [ -n "$TICKET_ID" ]; then
        # --- 8. Lecture du ticket créé ---
        response=$(call_api "GET" "/ticket/${TICKET_ID}" "" "$TOKEN")
        assert_status "Lecture du ticket créé" "200" "$response" > /dev/null

        # --- 9. Mise à jour du ticket ---
        response=$(call_api "PATCH" "/ticket/${TICKET_ID}" \
            "{\"status\":\"in_progress\"}" "$TOKEN")
        assert_status "Mise à jour du statut du ticket" "200" "$response" > /dev/null

        # --- 10. Ajout d'un commentaire ---
        response=$(call_api "POST" "/comment" \
            "{\"content\":\"Commentaire de test\",\"ticketId\":\"${TICKET_ID}\",\"authorId\":\"${USER_ID}\"}" "$TOKEN")
        body=$(assert_status "Ajout d'un commentaire sur le ticket" "201" "$response")
        COMMENT_ID=$(echo "$body" | jq -r '.id // empty' 2>/dev/null)

        # --- 11. Liste des commentaires du ticket ---
        response=$(call_api "GET" "/comment?ticketId=${TICKET_ID}" "" "$TOKEN")
        assert_status "Liste des commentaires du ticket" "200" "$response" > /dev/null

        # --- 12. Suppression du commentaire ---
        if [ -n "${COMMENT_ID:-}" ]; then
            response=$(call_api "DELETE" "/comment/${COMMENT_ID}" "" "$TOKEN")
            assert_status "Suppression du commentaire" "200" "$response" > /dev/null
        fi

        # --- 13. Suppression du ticket ---
        response=$(call_api "DELETE" "/ticket/${TICKET_ID}" "" "$TOKEN")
        assert_status "Suppression du ticket" "200" "$response" > /dev/null
    fi

    # --- 14. Suppression d'un utilisateur (pas de restriction de rôle
    # implémentée pour l'instant : tout utilisateur authentifié peut
    # supprimer un compte, y compris le sien) ---
    if [ -n "${USER_ID:-}" ]; then
        response=$(call_api "DELETE" "/users/${USER_ID}" "" "$TOKEN")
        assert_status "Suppression de l'utilisateur de test" "200" "$response" > /dev/null
    fi

    # --- 15. Ressource inexistante ---
    response=$(call_api "GET" "/ticket/00000000-0000-0000-0000-000000000000" "" "$TOKEN")
    assert_status "404 sur un ticket inexistant" "404" "$response" > /dev/null
}

print_summary() {
    echo -e "${BLUE}================================${NC}" >&2
    echo -e "${BLUE}  Résumé ${NC}" >&2
    echo -e "${BLUE}================================${NC}" >&2
    print_message "Tests réussis : ${PASS_COUNT}"
    if [ "$FAIL_COUNT" -gt 0 ]; then
        print_error "Tests échoués : ${FAIL_COUNT}"
    else
        print_message "Tests échoués : ${FAIL_COUNT}"
    fi

    if [ "$FAIL_COUNT" -gt 0 ]; then
        exit 1
    fi
}

main() {
    print_header
    check_dependencies
    print_message "Utilisateur de test: ${TEST_EMAIL}"
    run_tests
    print_summary
}

main