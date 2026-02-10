# Spendly

A full-stack expense tracking application built as a learning project. Monorepo with **NestJS** backend and **Angular 21** frontend.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Angular](https://img.shields.io/badge/Angular-21-red)
![NestJS](https://img.shields.io/badge/NestJS-11-red)
![Prisma](https://img.shields.io/badge/Prisma-7-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-blue)

## Features

- User registration & login with JWT authentication (httpOnly cookies)
- Bank account management (Checking, Savings, Wallet, Investment)
- Credit & debit card tracking with color themes
- Income & expense transaction recording
- Transfers between accounts with status tracking
- Savings goals with deposit tracking
- Statistics dashboard with charts (by category, trends, overview)
- CSV export of transactions
- Custom & default expense/income categories
- Password recovery via email
- Light & dark theme support

## Tech Stack

| Layer        | Technology                                                  |
| ------------ | ----------------------------------------------------------- |
| **Frontend** | Angular 21, Signals, TailwindCSS 4, Spartan UI, ApexCharts |
| **Backend**  | NestJS 11, Passport JWT, Prisma 7, class-validator          |
| **Database** | PostgreSQL (Neon serverless)                                |
| **Tooling**  | npm workspaces, Biome, Vitest, Jest, Concurrently           |

## Project Structure

```
spendly/
├── api/                    # NestJS REST API
│   ├── prisma/             #   Database schema & migrations
│   └── src/
│       ├── modules/        #   Feature modules (auth, bank-account, card, ...)
│       ├── infrastructure/ #   Prisma & mail services
│       └── common/         #   Shared decorators & utilities
├── web/                    # Angular 21 SPA
│   └── src/app/
│       ├── core/           #   Services, guards, interceptors, API clients
│       ├── pages/          #   Route components (lazy loaded)
│       └── shared/         #   Reusable components & UI library
├── package.json            # Workspace root
├── biome.json              # Linter/formatter config
└── CLAUDE.md               # AI assistant context
```

## Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ANGULAR SPA (port 4200)                       │
│                                                                 │
│  ┌───────────┐   ┌────────────┐   ┌──────────────────────────┐ │
│  │  Guest     │   │   Auth     │   │  Protected Pages         │ │
│  │  Pages     │   │   Flow     │   │  (behind authGuard)      │ │
│  │            │   │            │   │                          │ │
│  │ /login    ─┼──►│  AuthApi   │   │  /dashboard  Overview    │ │
│  │ /register  │   │     ↓      │   │  /accounts   Bank accts  │ │
│  │ /recover   │   │  AuthSvc   │   │  /cards      Card mgmt   │ │
│  │ /reset     │   │  (signals) │   │  /categories Categories  │ │
│  └────────────┘   └─────┬──────┘   │  /profile    User prefs  │ │
│                         │          └───────────┬──────────────┘ │
│                         ▼                      │                │
│               ┌──────────────────┐             │                │
│               │ authInterceptor  │◄────────────┘                │
│               │ • withCredentials│                               │
│               │ • 401 → refresh  │                               │
│               │ • retry request  │                               │
│               └────────┬─────────┘                              │
└────────────────────────┼────────────────────────────────────────┘
                         │  HTTP + httpOnly cookies
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NESTJS API (port 3000)                        │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Middleware Layer                          │  │
│  │  cookie-parser → ValidationPipe → JwtAuthGuard            │  │
│  └─────────────────────────┬─────────────────────────────────┘  │
│                            │                                    │
│  ┌─────────────────────────▼─────────────────────────────────┐  │
│  │                   Module Router                           │  │
│  │                                                           │  │
│  │  /auth          → register, login, refresh, logout        │  │
│  │  /users         → profile, update avatar                  │  │
│  │  /bank-accounts → CRUD bank accounts                      │  │
│  │  /cards         → CRUD cards + expenses query             │  │
│  │  /transactions  → CRUD transactions                       │  │
│  │  /categories    → CRUD categories (default + custom)      │  │
│  │  /transfers     → CRUD transfers between accounts         │  │
│  │  /statistics    → overview, by-category, trends           │  │
│  │  /export        → CSV transaction export                  │  │
│  │  /goals         → CRUD goals + deposits                   │  │
│  └─────────────────────────┬─────────────────────────────────┘  │
│                            │                                    │
│  ┌─────────────────────────▼─────────────────────────────────┐  │
│  │           Services + @CurrentUser() decorator             │  │
│  │      All queries filtered by userId (data isolation)      │  │
│  └─────────────────────────┬─────────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    POSTGRESQL (Neon)                             │
│                                                                 │
│  ┌────────┐ ┌──────────────┐ ┌───────┐ ┌─────────────┐        │
│  │ users  │ │bank_accounts │ │ cards │ │transactions │        │
│  └────────┘ └──────────────┘ └───────┘ └─────────────┘        │
│  ┌────────┐ ┌──────────────┐ ┌───────┐ ┌─────────────┐        │
│  │ tokens │ │  transfers   │ │ goals │ │ categories  │        │
│  └────────┘ └──────────────┘ └───────┘ └─────────────┘        │
│  ┌──────────┐                                                   │
│  │ deposits │                                                   │
│  └──────────┘                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
  Register/Login                        Authenticated Request
  ─────────────                         ─────────────────────

  Client              API               Client              API
    │                  │                   │                  │
    │  POST /login     │                   │  GET /accounts   │
    │  {email, pass}   │                   │  Cookie: token   │
    ├─────────────────►│                   ├─────────────────►│
    │                  │                   │                  │
    │  validate creds  │                   │  JwtAuthGuard    │
    │  sign JWT pair   │                   │  extract user    │
    │  set cookies     │                   │  @CurrentUser()  │
    │                  │                   │                  │
    │◄─────────────────┤                   │◄─────────────────┤
    │  Set-Cookie:     │                   │  200 OK          │
    │  access (15min)  │                   │                  │
    │  refresh (7d)    │


  Token Refresh (automatic via authInterceptor)
  ─────────────────────────────────────────────

  Client              API
    │  GET /resource    │
    ├─────────────────►│
    │  401 Unauthorized │
    │◄─────────────────┤
    │                   │
    │  POST /refresh    │   ← interceptor catches 401
    │  Cookie: refresh  │
    ├──────────────────►│
    │  new cookies      │
    │◄──────────────────┤
    │                   │
    │  retry original   │   ← retry with new token
    ├──────────────────►│
    │  200 OK           │
    │◄──────────────────┤
```

## Database Schema

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    User      │       │   BankAccount    │       │     Card     │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id       (PK)│──┐    │ id           (PK)│──┐    │ id       (PK)│
│ email        │  │    │ userId       (FK)│  │    │ userId   (FK)│
│ name         │  │    │ name             │  │    │ bankAccId(FK)│
│ passwordHash │  │    │ type  (enum)     │  │    │ name         │
│ avatarUrl    │  │    │ currency (enum)  │  │    │ color  (enum)│
└──────┬───────┘  │    │ balance          │  │    │ type   (enum)│
       │          │    │ initialBalance   │  │    │ lastFour     │
       │ 1:N      │    └────────┬─────────┘  │    │ creditLimit  │
       │          │             │             │    └──────┬───────┘
       ▼          │             │ 1:N         │           │ 1:N
┌──────────────┐  │    ┌────────▼─────────┐  │    ┌──────▼───────┐
│   Category   │  │    │    Transfer      │  │    │ Transaction  │
├──────────────┤  │    ├──────────────────┤  │    ├──────────────┤
│ id       (PK)│  │    │ id           (PK)│  │    │ id       (PK)│
│ userId   (FK)│  │    │ userId       (FK)│  │    │ cardId   (FK)│
│ title        │  │    │ fromAccId    (FK)│  │    │ bankAccId(FK)│
│ icon         │  │    │ toAccId      (FK)│  │    │ categoryId   │
│ isDefault    │  │    │ amount           │  │    │ title        │
│ type  (enum) │  │    │ date             │  │    │ type   (enum)│
└──────────────┘  │    │ status (enum)    │  │    │ amount       │
                  │    └──────────────────┘  │    │ date         │
┌──────────────┐  │                          │    └──────────────┘
│     Goal     │  │    ┌──────────────────┐  │
├──────────────┤  │    │    Deposit       │  │
│ id       (PK)│◄─┘    ├──────────────────┤  │
│ userId   (FK)│       │ id           (PK)│  │
│ title        │       │ amount           │  │
│ amount       │───1:N─│ goalId       (FK)│  │
│ currentAmount│       └──────────────────┘  │
│ deadline     │                             │
└──────────────┘  ┌──────────────────┐       │
                  │    Token         │       │
                  ├──────────────────┤       │
                  │ id           (PK)│◄──────┘
                  │ type       (enum)│  belongs to User
                  │ code    (5 char) │
                  │ userId       (FK)│
                  └──────────────────┘
```

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **npm** >= 10
- **PostgreSQL** (or a [Neon](https://neon.tech) account)

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd spendly
   npm install
   ```

2. **Configure the database**

   ```bash
   cp api/.env.example api/.env
   # Edit api/.env and set your DATABASE_URL
   # Example: DATABASE_URL="postgresql://user:pass@localhost:5432/spendly"
   ```

3. **Run migrations and seed**

   ```bash
   cd api
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Start development servers**

   ```bash
   # From root — starts both API and Web
   npm run dev
   ```

   - API: http://localhost:3000
   - Web: http://localhost:4200
   - Swagger: http://localhost:3000/api
   - Scalar docs: http://localhost:3000/docs

### Available Scripts

| Command          | Description                         |
| ---------------- | ----------------------------------- |
| `npm run dev`    | Start both API and Web concurrently |
| `npm run dev:api`| Start API only                      |
| `npm run dev:web`| Start Web only                      |
| `npm run build`  | Build both workspaces               |

## Learning Goals

This project was built to learn and practice:

- **Angular 21** — Signals, standalone components, new control flow (`@if`, `@for`), lazy loading
- **NestJS** — Modular architecture, guards, decorators, Swagger docs
- **Prisma** — Schema design, migrations, relations, custom generators
- **JWT Authentication** — httpOnly cookies, refresh tokens, interceptors
- **TailwindCSS 4** — Utility-first CSS, theming, dark mode
- **Monorepo** — npm workspaces, shared tooling

## License

This project is for personal learning purposes.
