#!/bin/bash

echo "🚀 ITGO - Setup Inicial"
echo "======================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo "Node.js no está instalado. Por favor, instálalo desde https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
echo -e "${BLUE}Verificando npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo "npm no está instalado"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Install dependencies
echo ""
echo -e "${BLUE}Instalando dependencias...${NC}"
npm install
echo -e "${GREEN}✓ Dependencias instaladas${NC}"

# Create .env.local
echo ""
echo -e "${BLUE}Creando archivo .env.local...${NC}"
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✓ Archivo .env.local creado${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Por favor, edita .env.local con tus credenciales de Supabase${NC}"
    echo "   1. Ve a https://supabase.com"
    echo "   2. Crea un nuevo proyecto"
    echo "   3. Copia las credenciales a .env.local"
else
    echo -e "${YELLOW}⚠️  .env.local ya existe${NC}"
fi

# Check Supabase CLI
echo ""
echo -e "${BLUE}Verificando Supabase CLI...${NC}"
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}Supabase CLI no está instalado${NC}"
    echo "Instalando..."
    npm install -g supabase
    echo -e "${GREEN}✓ Supabase CLI instalado${NC}"
else
    echo -e "${GREEN}✓ Supabase CLI presente${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup completado${NC}"
echo ""
echo "Próximos pasos:"
echo "1. Edita .env.local con tus credenciales de Supabase"
echo "2. Ejecuta: npm run supabase:start"
echo "3. Ejecuta: npm run db:push"
echo "4. Ejecuta: npm run dev"
echo ""
echo "Para más información, ver README.md"
