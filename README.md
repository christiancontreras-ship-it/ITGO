# ITGO - Marketplace TI OnDemand

**Tu equipo TI, cuando lo necesitas**

ITGO es el primer Marketplace TI OnDemand de Latinoamérica que conecta empresas con especialistas certificados en infraestructura, cloud, seguridad y más.

## 📋 Características Principales

### Para Clientes PyME/Empresas
- 📝 Crear y gestionar tickets de soporte
- 👥 Acceso a marketplace de especialistas
- 💬 Chat en tiempo real con especialistas
- 💳 Sistema de pagos integrado
- 📊 Dashboard con métricas y SLA
- ⚙️ Gestión de servicios gestionados
- 📈 Reportes detallados

### Para Especialistas
- 💼 Perfil profesional con certificaciones
- ⭐ Sistema de ratings y reviews
- 📊 Dashboard con métricas de desempeño
- 💰 Gestión de ingresos
- 📱 Notificaciones en tiempo real

### Para Administradores
- 👥 Gestión completa de usuarios
- 💰 Administración de comisiones
- 📊 Analytics y reportes
- ⚠️ Resolución de disputas
- 🔧 Configuración del sistema

## 🚀 Stack Tecnológico

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Shadcn/UI** - Componentes UI
- **Zustand** - State management
- **Recharts** - Visualización de datos

### Backend & Datos
- **Supabase** - BaaS (PostgreSQL, Auth, Storage)
- **PostgreSQL** - Base de datos
- **Next.js API Routes** - Backend serverless

### Integraciones
- **Claude API** - IA para clasificación y matching
- **Mercado Pago** - Procesamiento de pagos
- **Resend** - Email notifications
- **WhatsApp Cloud API** - Notificaciones WhatsApp
- **Zabbix** - Monitoreo de infraestructura

### Deployment
- **Vercel** - Hosting del frontend
- **Supabase** - Hosting de base de datos

## 📦 Instalación

### Requisitos Previos
- Node.js >= 18.0.0
- npm >= 9.0.0
- Una cuenta en [Supabase](https://supabase.com)
- Una cuenta en [Vercel](https://vercel.com)

### Pasos de Instalación

#### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd itgo
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Claude API
ANTHROPIC_API_KEY=your-claude-api-key

# Mercado Pago
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=your-mp-public-key
MERCADO_PAGO_ACCESS_TOKEN=your-mp-access-token

# Otros servicios...
```

#### 4. Configurar Supabase

##### 4.1 Crear Proyecto en Supabase
1. Ir a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Copiar URL y llaves a `.env.local`

##### 4.2 Ejecutar migraciones
```bash
# Conectar a Supabase
supabase link --project-ref your-project-ref

# Ejecutar migraciones
supabase db push
```

##### 4.3 Cargar datos de demostración
```bash
supabase db seed
```

O manualmente:
```bash
supabase db execute < supabase/seeds/demo-data.sql
```

#### 5. Ejecutar localmente
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Credenciales de Demostración

Usa estas credenciales para probar:

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@itgo.com | password |
| Cliente | cliente1@pyme.com | password |
| Especialista | especialista1@itgo.com | password |
| Partner | partner1@itgo.com | password |

## 🌐 Deployment en Vercel

### 1. Preparar el proyecto
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Importar en Vercel
1. Ir a [vercel.com](https://vercel.com)
2. Hacer click en "New Project"
3. Seleccionar repositorio GitHub
4. Configurar variables de entorno
5. Click en "Deploy"

### 3. Configurar variables en Vercel
En "Settings" → "Environment Variables", agregar:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `MERCADO_PAGO_ACCESS_TOKEN`
- Todas las demás variables del `.env.example`

## 📁 Estructura del Proyecto

```
itgo/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── auth/            # Páginas de autenticación
│   │   ├── dashboard/       # Dashboard principal
│   │   └── api/             # API routes
│   ├── components/          # Componentes React
│   ├── lib/                 # Funciones utilitarias
│   ├── store/               # Zustand stores
│   └── types/               # Tipos TypeScript
├── supabase/
│   ├── migrations/          # Migraciones de BD
│   └── seeds/               # Datos de demostración
├── public/                  # Assets estáticos
└── scripts/                 # Scripts útiles
```

## 🔐 Seguridad

- ✅ JWT para autenticación
- ✅ RLS (Row Level Security) en Supabase
- ✅ Validación en frontend y backend
- ✅ OWASP Top 10 compliance
- ✅ Rate limiting en APIs
- ✅ Encriptación de datos sensibles
- ✅ Audit logs de todas las acciones

## 📊 Tablas de la Base de Datos

### Usuarios y Autenticación
- `users` - Usuarios del sistema
- `companies` - Empresas registradas
- `specialists` - Perfiles de especialistas
- `partners` - Empresas partners

### Tickets y Servicios
- `tickets` - Tickets de soporte
- `ticket_messages` - Mensajes en tickets
- `ticket_files` - Archivos en tickets
- `contracts` - Contratos de servicios
- `managed_services` - Servicios gestionados

### Comunicación
- `chat_conversations` - Conversaciones de chat
- `chat_messages` - Mensajes de chat

### Finanzas
- `payments` - Transacciones de pago
- `commissions` - Comisiones generadas
- `subscriptions` - Suscripciones de usuarios

### Monitoreo y Alertas
- `monitoring_assets` - Activos monitoreados
- `alerts` - Alertas del sistema
- `notifications` - Notificaciones de usuarios

### Otros
- `ratings` - Calificaciones de especialistas
- `audit_logs` - Log de auditoría

## 🤖 Integraciones de IA

### Clasificación Automática
- Detecta categoría del ticket
- Asigna prioridad automática
- Calcula complejidad estimada

### Estimación de Costos
- Calcula horas estimadas
- Propone precio sugerido
- Basado en historiales

### Matching de Especialistas
- Recomienda especialistas
- Basado en skills y ratings
- Considera disponibilidad

## 💳 Sistema de Pagos

Integrado con **Mercado Pago**:
- Pago por ticket individual
- Pago de suscripciones
- Pago de servicios gestionados
- Comisión configurable (default: 20%)

## 📧 Notificaciones

Canales soportados:
- Email (via Resend)
- WhatsApp (via WhatsApp Cloud API)
- In-app notifications

## 📈 Monitoreo

Integración con **Zabbix**:
- Monitoreo de CPU, RAM, Disco
- Disponibilidad de servicios
- Alertas automáticas
- Creación automática de tickets

## 🔧 Scripts Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Construcción
npm run build            # Compilar para producción

# Testing
npm run lint             # Ejecutar linter
npm run type-check       # Verificar tipos

# Supabase
npm run supabase:start   # Iniciar Supabase local
npm run db:push          # Hacer push de cambios a DB
npm run db:seed          # Cargar datos de demostración

# Deployment
npm run deploy           # Desplegar a Vercel
```

## 🐛 Debugging

Habilitar logs detallados:
```env
LOG_LEVEL=debug
NODE_ENV=development
```

Ver logs en Vercel:
```bash
vercel logs
```

## 📚 API Documentation

### Endpoints principales

#### Autenticación
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/logout` - Logout

#### Tickets
- `GET /api/tickets` - Listar tickets
- `POST /api/tickets` - Crear ticket
- `GET /api/tickets/{id}` - Obtener ticket
- `PUT /api/tickets/{id}` - Actualizar ticket
- `DELETE /api/tickets/{id}` - Eliminar ticket

#### Especialistas
- `GET /api/specialists` - Listar especialistas
- `GET /api/specialists/{id}` - Obtener especialista

#### Pagos
- `GET /api/payments` - Listar pagos
- `POST /api/payments` - Crear pago
- `POST /api/payments/webhook` - Webhook de Mercado Pago

#### IA
- `POST /api/ai/classify` - Clasificar ticket
- `POST /api/ai/estimate` - Estimar costo
- `POST /api/ai/match` - Buscar especialistas

## 🤝 Soporte

Para reportar bugs o solicitar features, crear un issue en GitHub.

## 📄 Licencia

Propietario - ITGO 2024

## 🎯 Roadmap

- [ ] Integración con más plataformas de pago
- [ ] Mobile app (React Native)
- [ ] Integración con más herramientas de monitoreo
- [ ] Machine learning para predicción de SLA
- [ ] Marketplace de plantillas
- [ ] API pública

## 👥 Autor

**ITGO Team** - Tu equipo TI, cuando lo necesitas

---

**Última actualización:** Junio 2024
