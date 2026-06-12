#!/bin/bash

echo "🚀 ITGO - Deploy a Vercel"
echo "========================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check Vercel CLI
echo -e "${BLUE}Verificando Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI no está instalado${NC}"
    echo "Instalando..."
    npm install -g vercel
    echo -e "${GREEN}✓ Vercel CLI instalado${NC}"
fi

# Check if logged in
echo ""
echo -e "${BLUE}Verificando autenticación en Vercel...${NC}"
vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}No estás autenticado en Vercel${NC}"
    echo "Iniciando sesión..."
    vercel login
fi
echo -e "${GREEN}✓ Autenticado en Vercel${NC}"

# Build
echo ""
echo -e "${BLUE}Compilando proyecto...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Error en la compilación${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Proyecto compilado${NC}"

# Deploy
echo ""
echo -e "${BLUE}Desplegando a Vercel...${NC}"
vercel deploy --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Despliegue completado${NC}"
    echo ""
    echo "Tu aplicación estará disponible en unos momentos."
    echo "Verifica el estado en: https://vercel.com/dashboard"
else
    echo ""
    echo -e "${RED}✗ Error al desplegar${NC}"
    exit 1
fi
