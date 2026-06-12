# ITGO - Marketplace TI OnDemand
## Estructura de Carpetas Completa

```
itgo/
├── .env.example
├── .env.local
├── .gitignore
├── .eslintrc.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md
├── public/
│   ├── favicon.ico
│   ├── logo-header.svg
│   ├── logo-login.svg
│   ├── logo-mobile.svg
│   ├── logo-dashboard.svg
│   └── itgo-logo.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── auth/
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── mfa/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── tickets/page.tsx
│   │   │   ├── tickets/[id]/page.tsx
│   │   │   ├── marketplace/page.tsx
│   │   │   ├── chat/page.tsx
│   │   │   ├── payments/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── managed-services/page.tsx
│   │   │   ├── monitoring/page.tsx
│   │   │   ├── reports/page.tsx
│   │   │   ├── admin/
│   │   │   │   ├── users/page.tsx
│   │   │   │   ├── commissions/page.tsx
│   │   │   │   ├── disputes/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │   └── partner/
│   │   │       ├── specialists/page.tsx
│   │   │       └── earnings/page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── [...nextauth]/route.ts
│   │       │   ├── callback/route.ts
│   │       │   └── mfa/route.ts
│   │       ├── tickets/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── chat/route.ts
│   │       ├── payments/route.ts
│   │       ├── ai/
│   │       │   ├── classify/route.ts
│   │       │   ├── estimate/route.ts
│   │       │   └── match/route.ts
│   │       ├── specialists/route.ts
│   │       ├── monitoring/route.ts
│   │       └── reports/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── MFAForm.tsx
│   │   │   └── PasswordRecovery.tsx
│   │   ├── tickets/
│   │   │   ├── TicketList.tsx
│   │   │   ├── TicketCard.tsx
│   │   │   ├── TicketDetail.tsx
│   │   │   ├── CreateTicketForm.tsx
│   │   │   └── TicketStatusBadge.tsx
│   │   ├── marketplace/
│   │   │   ├── SpecialistCard.tsx
│   │   │   ├── SpecialistProfile.tsx
│   │   │   ├── SpecialistFilter.tsx
│   │   │   └── SpecialistGrid.tsx
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── FileUpload.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── RecentTickets.tsx
│   │   │   ├── SLAChart.tsx
│   │   │   └── AlertsPanel.tsx
│   │   ├── payments/
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── PaymentHistory.tsx
│   │   │   └── CommissionBreakdown.tsx
│   │   ├── admin/
│   │   │   ├── UserManagement.tsx
│   │   │   ├── CommissionSettings.tsx
│   │   │   └── FinanceOverview.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── Loading.tsx
│   │       └── Toast.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   ├── api-client.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   ├── utils.ts
│   │   └── hooks/
│   │       ├── useAuth.ts
│   │       ├── useTickets.ts
│   │       ├── usePayments.ts
│   │       ├── useChat.ts
│   │       └── useMonitoring.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── ticketStore.ts
│   │   ├── chatStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   ├── functions/
│   │   ├── classify-ticket/
│   │   │   └── index.ts
│   │   ├── estimate-cost/
│   │   │   └── index.ts
│   │   └── match-specialists/
│   │       └── index.ts
│   └── seeds/
│       ├── users.sql
│       ├── specialists.sql
│       ├── categories.sql
│       └── demo-data.sql
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   ├── seed-db.sh
│   └── migrate.sh
└── docs/
    ├── API.md
    ├── DATABASE.md
    ├── DEPLOYMENT.md
    └── SECURITY.md
```
