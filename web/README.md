# Spendly Web

Angular 21 single-page application with **standalone components**, **signals**, and **TailwindCSS 4**.

## Architecture

```
src/app/
├── app.routes.ts              # Route definitions (lazy loaded)
├── app.config.ts              # Providers (router, http, interceptors)
├── core/                      # Singleton services & infrastructure
│   ├── api/                   #   HTTP clients (one per resource)
│   │   ├── auth/              #     AuthApi (login, register, refresh)
│   │   ├── bank-accounts.api  #     BankAccountsApi
│   │   ├── cards.api          #     CardsApi
│   │   ├── categories.api     #     CategoriesApi
│   │   ├── transfers.api      #     TransfersApi
│   │   └── users.api          #     UsersApi
│   ├── services/              #   State management (signals)
│   │   ├── auth/              #     AuthService (currentUser signal)
│   │   ├── bank-accounts      #     BankAccountsService
│   │   ├── cards              #     CardsService
│   │   ├── categories         #     CategoriesService
│   │   ├── transfers          #     TransfersService
│   │   └── users              #     UsersService
│   ├── guards/                #   Route protection
│   │   ├── auth.guard         #     Redirects unauthenticated → /login
│   │   └── guest.guard        #     Redirects authenticated → /dashboard
│   ├── interceptors/
│   │   └── auth.interceptor   #     401 refresh + withCredentials
│   └── strategies/
│       └── page-title         #     Dynamic page titles
├── pages/                     # Route components (all lazy loaded)
│   ├── login/                 #   Login form
│   ├── register/              #   Registration form
│   ├── password/
│   │   ├── recover/           #   Email recovery form
│   │   └── reset/             #   New password form
│   ├── dashboard/             #   Main dashboard with charts
│   ├── bank-account/          #   Account list + detail view
│   ├── cards/                 #   Card management
│   ├── categories/            #   Category management
│   └── user-profile/          #   Profile settings
└── shared/                    # Reusable components
    └── components/
        ├── layout/            #   App shell (header + sidebar + content)
        ├── header/            #   Top navigation bar
        ├── sidebar/           #   Collapsible sidebar navigation
        ├── dashboard/         #   Dashboard widgets
        │   ├── dashboard-cards/    Balance, income, expense, goal cards
        │   ├── dashboard-chart/    Category + transaction charts
        │   └── dashboard-transactions/  Recent transactions list
        ├── bank-accounts/     #   Account list, card, form, totals
        ├── cards/             #   Card list, preview, form, color picker
        ├── categories/        #   Category list, form, icon picker
        ├── transfers/         #   Transfer form
        ├── ui/                #   Base UI components (button, input, dialog...)
        └── ui/spartan/        #   Spartan UI primitives (shadcn for Angular)
```

## Component Flow

```
                         app.routes.ts
                              │
              ┌───────────────┼───────────────┐
              │               │               │
         Guest Routes    Auth Guard      Wildcard
         (guestGuard)         │           → /dashboard
              │               │
    ┌─────────┼─────────┐    │
    │         │         │    │
  Login   Register  Password │
    │                        │
    └────────┬───────────────┘
             │ successful auth
             ▼
    ┌────────────────┐
    │     Layout     │   ← App shell (always rendered for auth routes)
    │  ┌──────────┐  │
    │  │  Header  │  │   ← Logo, profile button, theme toggle
    │  ├──────────┤  │
    │  │ Sidebar  │  │   ← Navigation links, collapsible
    │  ├──────────┤  │
    │  │          │  │
    │  │  <page>  │  │   ← Lazy-loaded route component
    │  │          │  │
    │  └──────────┘  │
    └────────────────┘
             │
     ┌───────┼───────┬──────────┬──────────┐
     │       │       │          │          │
 Dashboard Accounts Cards  Categories  Profile
     │       │       │          │
     │       │       │     ┌────┴────┐
     │       │       │   List    Form+IconPicker
     │       │       │
     │       │    ┌──┴──────────┐
     │       │  List  Preview  Form+ColorPicker
     │       │
     │    ┌──┴──────────────────┐
     │  List  Card  Form  Totals  Detail→(balance, chart, recent)
     │
  ┌──┴──────────────────────────────┐
  │  DashboardCards                 │
  │  (BalanceCard, IncomeCard,      │
  │   ExpenseCard, GoalCard)        │
  ├─────────────────────────────────┤
  │  DashboardCharts                │
  │  (CategoryChart, TxnChart)      │
  ├─────────────────────────────────┤
  │  DashboardTransactions          │
  │  (Recent transaction list)      │
  └─────────────────────────────────┘
```

## State Management

Signal-based reactive state (no NgRx):

```
┌───────────────┐     ┌───────────────┐     ┌────────────────┐
│   Component   │     │    Service    │     │    API Client   │
│               │     │   (signals)   │     │   (HttpClient)  │
│  reads signal─┼────►│  currentUser  │     │                │
│               │     │  isAuthenticated    │                │
│  calls method─┼────►│  login()──────┼────►│  POST /login   │
│               │     │  logout()     │     │                │
│               │     │  verifyAuth() │     │  GET /profile  │
└───────────────┘     └───────────────┘     └────────────────┘

Example: AuthService
├── currentUser = signal<User | null>(null)
├── isAuthenticated = computed(() => !!this.currentUser())
├── login(dto) → api.login() → set currentUser signal
├── register(dto) → api.register() → set currentUser signal
├── verifyAuth() → api.profile() || api.refresh() → set or clear
└── logout() → api.logout() → set currentUser to null
```

## Routes

| Path                   | Guard   | Component      | Description           |
| ---------------------- | ------- | -------------- | --------------------- |
| `/login`               | guest   | Login          | Email/password login  |
| `/register`            | guest   | Register       | Create account        |
| `/password/recover`    | guest   | Recover        | Request recovery code |
| `/password/reset`      | guest   | Reset          | Set new password      |
| `/dashboard`           | auth    | Dashboard      | Overview + charts     |
| `/accounts`            | auth    | BankAccount    | List bank accounts    |
| `/account-details/:id` | auth    | AccountDetails | Single account view   |
| `/cards`               | auth    | Cards          | Manage cards          |
| `/categories`          | auth    | Categories     | Manage categories     |
| `/profile`             | auth    | UserProfile    | Edit profile          |

## UI Library

- **Spartan UI** — Angular port of shadcn/ui (headless primitives)
- **TailwindCSS 4** — Utility-first styling with OKLCH color tokens
- **Lucide Angular** — Icon library
- **ApexCharts** — Charts via ng-apexcharts
- **ngx-sonner** — Toast notifications
- **DaisyUI** — Additional Tailwind components

### Custom UI Components

Located in `shared/components/ui/`:

`avatar` `badge` `button` `calendar` `card` `checkbox` `date-picker`
`dialog` `divider` `dropdown` `icon` `input` `popover` `progress-bar`
`select` `sheet`

### Theming

CSS custom properties with OKLCH color space supporting light and dark modes.
Toggle via the theme switcher component in the header.

## Key Angular 21 Patterns Used

- **Standalone components** — No NgModules, each component declares its own imports
- **Signals** — `signal()`, `computed()` for reactive state
- **New control flow** — `@if`, `@for`, `@switch` instead of `*ngIf`, `*ngFor`
- **Function-based guards** — `authGuard`, `guestGuard` (not class-based)
- **Lazy loading** — All routes use `loadComponent()`
- **`input()` / `output()`** — Signal-based component I/O
- **Route resolvers** — Pre-fetch data before component renders
- **Custom TitleStrategy** — Dynamic page titles per route

## Commands

```bash
# Development
npm start              # Serve on http://localhost:4200

# Build
npm run build          # Production build
npm run watch          # Dev build with file watching

# Testing
npm test               # Run Vitest tests
```

## Environment

Configure API URL in `src/environments/`:

```typescript
// environment.development.ts
export const environment = {
  apiUrl: 'http://localhost:3000',
}
```
