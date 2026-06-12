# ⚡ ITGO - Quick Start Guide

**Inicia ITGO en 10 minutos**

## Paso 1: Clonar y Instalar (2 minutos)

```bash
# Clonar el proyecto
git clone <repository-url>
cd itgo

# Instalar dependencias
npm install
```

## Paso 2: Crear Cuenta en Supabase (3 minutos)

1. Ir a https://supabase.com
2. Crear nuevo proyecto
3. Copiar `Project URL` y `Anon Key`
4. Editar `.env.local`:

```bash
cp .env.example .env.local
```

Agregar estas líneas a `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Paso 3: Ejecutar Localmente (3 minutos)

```bash
# Iniciar servidor de desarrollo
npm run dev
```

Abrir http://localhost:3000

## Paso 4: Login con Credenciales Demo

```
Email: admin@itgo.com
Contraseña: password
```

---

## 🌐 Desplegar en Vercel (2 minutos)

### Opción A: Manual
```bash
npm install -g vercel
vercel deploy --prod
```

### Opción B: GitHub + Vercel (Recomendado)
1. Push código a GitHub
2. Ir a vercel.com
3. Importar repositorio
4. Agregar variables de entorno
5. Deploy automático

---

## 📝 Requisitos Mínimos

- Node.js 18+
- npm 9+
- Cuenta Supabase (gratuito)
- (Opcional) Cuenta Vercel (gratuito)

---

## 🔑 Credenciales de Prueba

```
Admin:
  Email: admin@itgo.com
  Pass: password

Cliente:
  Email: cliente1@pyme.com
  Pass: password

Especialista:
  Email: especialista1@itgo.com
  Pass: password
```

---

## 🆘 Troubleshooting

### Error: "Cannot find supabase"
```bash
npm install @supabase/supabase-js
```

### Error: "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### Error: "RLS Policy Error"
Ir a Supabase → Policies y desabilitar RLS temporalmente

---

## 📚 Documentación Completa

Ver `README.md` para:
- ✅ Instalación detallada
- ✅ Variables de entorno completas
- ✅ API documentation
- ✅ Estructura del proyecto
- ✅ Scripts útiles

---

## 🚀 Próximos Pasos

1. Personalizar colores/logo
2. Configurar Mercado Pago
3. Agregar Claude API
4. Configurar dominio personalizado
5. Ir a producción

---

**¿Necesitas ayuda?**

Ver archivos:
- `README.md` - Documentación completa
- `PROYECTO_COMPLETADO.md` - Resumen del proyecto
- `src/types/index.ts` - Tipos disponibles

---

**¡Listo! Tu aplicación está corriendo. 🎉**
