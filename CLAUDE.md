# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular Expenses Tracker - A full-stack expense tracking application built as an npm workspace monorepo with NestJS backend and Angular 21 frontend.

**Workspaces:**
- `api/` - NestJS REST API with Prisma ORM
- `web/` - Angular 21 standalone components frontend

## Common Commands

### Root Level (Monorepo)

```bash
# Start both API and web concurrently
npm run dev

# Start API only
npm run dev:api

# Start web only
npm run dev:web

# Build both workspaces
npm run build

# Format/lint with Biome
npx biome check .
npx biome check --write .
```

### API (NestJS)

```bash
cd api

# Development
npm run dev              # Start with hot reload
npm run start:debug      # Start with debugger

# Build & Production
npm run build
npm run start:prod

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:cov         # With coverage
npm run test:e2e         # E2E tests

# Database (Prisma)
npx prisma migrate dev           # Create and apply migration
npx prisma migrate dev --name <migration-name>
npx prisma db push               # Push schema without migration
npx prisma studio                # Open database GUI
npx prisma generate              # Regenerate Prisma Client
npx prisma db seed               # Run seed script
```

### Web (Angular)

```bash
cd web

# Development
npm start                # Serves on http://localhost:4200

# Build
npm run build            # Production build
npm run watch            # Development build with watch

# Testing
npm test                 # Run Vitest tests
```

## Architecture

### Backend (NestJS)

**Module Organization:** Feature-based modules in `api/src/modules/`

```
modules/
├── auth/          - Authentication (JWT + refresh tokens)
├── users/         - User management
├── wallet/        - Wallet CRUD
├── category/      - Expense categories
├── transaction/   - Financial transactions
├── statistic/     - Analytics & aggregations
├── export/        - CSV export
└── goal/          - Savings goals
```

**Key Patterns:**

- **Authentication:** JWT tokens stored in httpOnly cookies (accessToken: 15min, refreshToken: 7 days)
- **Route Protection:** All protected routes use `@UseGuards(JwtAuthGuard)` with `@CurrentUser()` decorator
- **Data Isolation:** All queries filtered by `userId` - critical for multi-tenancy
- **Prisma Client:** Generated to `api/src/generated/prisma` (custom output location)
- **Validation:** DTOs with class-validator decorators

**Example Protected Endpoint Pattern:**

```typescript
@UseGuards(JwtAuthGuard)
@Post('wallets')
async create(
  @Body() dto: CreateWalletDto,
  @CurrentUser() user // { userId, email }
) {
  return this.service.create(dto, user.userId)
}
```

**Critical: Data Isolation**

Always filter by userId in services:

```typescript
await this.prisma.wallet.findMany({
  where: { userId } // REQUIRED for security
})
```

### Frontend (Angular 21)

**Structure:**

```
web/src/app/
├── core/
│   ├── api/           - HTTP API clients (e.g., AuthApi)
│   ├── guards/        - Route guards (authGuard)
│   ├── services/      - State management (AuthService with signals)
│   └── interceptors/  - HTTP interceptors (auth token refresh)
├── pages/             - Routed components (lazy loaded)
└── app.routes.ts      - Routing configuration
```

**Key Patterns:**

- **State Management:** Signals (not NgRx) - see `AuthService.currentUser` signal
- **Components:** Standalone components (no NgModules)
- **Guards:** Function-based guards (`authGuard`)
- **Lazy Loading:** `loadComponent()` for route components
- **HTTP:** All requests use `withCredentials: true` for cookie-based auth
- **Forms:** Reactive forms with `FormBuilder`

**Auth Flow:**

1. Login/Register sets httpOnly cookies via API
2. `authGuard` checks `isAuthenticated` signal or calls `/profile`
3. `authInterceptor` automatically refreshes tokens on 401 errors
4. On refresh failure, redirects to `/login`

**Environment Configuration:**

- Development: `web/src/environments/environment.development.ts` (API: localhost:3000)
- Production: `web/src/environments/environment.ts`

### Database (Prisma)

**Schema:** `api/prisma/schema.prisma`

**Models:**
- User - Core user entity (UUID, bcrypt password)
- Wallet - User's financial accounts (CASH, BANK_ACCOUNT, CREDIT_CARD, etc.)
- Category - Expense/income categories (supports both default and custom)
- Transaction - Financial transactions linked to Wallet + Category
- Goal - Savings goals with Deposits tracking
- Token - Password recovery tokens

**Important Schema Details:**

- Custom Prisma client output: `../src/generated/prisma`
- Decimal precision for money: `Decimal @db.Decimal(12, 2)`
- Snake_case database columns mapped to camelCase: `@map("user_id")`
- Cascade deletes maintain referential integrity
- Categories can be user-specific (userId) or default (userId=null)

**Seed Data:** `api/prisma/seed.ts` and `api/prisma/categories.ts` for default categories

### Authentication Deep Dive

**Backend (NestJS):**
- Passport JWT strategy extracts from cookies
- `JwtAuthGuard` protects routes
- Tokens signed with secret from environment
- `@CurrentUser()` decorator injects user from request

**Frontend (Angular):**
- `AuthService` manages auth state with signals
- `authInterceptor` intercepts 401 errors and retries after refresh
- `authGuard` checks authentication before route activation
- All API calls include `withCredentials: true`

**Token Refresh Pattern:**

```
Request → 401 Error → authInterceptor
  → Call /refresh endpoint
  → Retry original request with new tokens
  → On refresh fail → logout & redirect to /login
```

## Development Workflow

### Starting Development

1. Ensure PostgreSQL is running (or use Neon connection string in `api/.env`)
2. Set `DATABASE_URL` in `api/.env`
3. Run migrations: `cd api && npx prisma migrate dev`
4. Start both servers: `npm run dev` (from root)
   - API: http://localhost:3000
   - Web: http://localhost:4200
   - Swagger docs: http://localhost:3000/api
   - Scalar docs: http://localhost:3000/docs

### Creating Database Changes

1. Modify `api/prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name <description>`
3. Prisma Client auto-regenerates
4. Update DTOs and services as needed

### Adding a New API Module

1. Generate module: `cd api && nest g module modules/<name>`
2. Generate service: `nest g service modules/<name>`
3. Generate controller: `nest g controller modules/<name>`
4. Import `PrismaModule` in the new module
5. Add route protection with `@UseGuards(JwtAuthGuard)`
6. Filter all queries by `userId` from `@CurrentUser()`

### Adding a New Frontend Route

1. Create component in `web/src/app/pages/<name>/`
2. Add route to `web/src/app/app.routes.ts` with `loadComponent()`
3. Add `canActivate: [authGuard]` for protected routes
4. Create API client in `web/src/app/core/api/` if needed

## Testing

### API Tests

- Unit tests alongside source: `*.spec.ts`
- E2E tests in `api/test/`
- Jest configuration in `api/package.json`
- Run single test file: `npm test -- <file-path>`

### Web Tests

- Uses Vitest (configured in Angular 21)
- Tests alongside components: `*.spec.ts`
- Run single test file: `npm test -- <pattern>` (e.g., `npm test -- auth`)

**Note:** Workspace-specific CLAUDE.md files exist for detailed conventions:
- `api/CLAUDE.md` - NestJS patterns and API conventions
- `web/CLAUDE.md` - Angular 21 patterns and component conventions

## Key Technologies

**Backend:**
- NestJS 11 (framework)
- Passport + JWT (authentication)
- Prisma 7 (ORM) with Neon adapter
- PostgreSQL (database)
- Bcrypt (password hashing)
- class-validator (validation)
- Swagger + Scalar (API docs)

**Frontend:**
- Angular 21 (framework)
- Signals (state management)
- RxJS 7.8 (async operations)
- TailwindCSS 4 (styling)
- Lucide Icons (icons)
- ngx-sonner (toast notifications)

## Code Style

- Biome for linting/formatting (config: `biome.json`)
- TypeScript strict mode enabled
- Tabs for indentation (width: 2)
- Line width: 80 characters
- Single quotes, semicolons as needed (ASI)
- Import organization handled by Biome assist

## Important Notes

**Security:**
- Never commit `.env` files (already in `.gitignore`)
- All user data queries MUST filter by `userId`
- Passwords stored as bcrypt hashes (10 salt rounds)
- JWT tokens in httpOnly cookies only

**Database:**
- Always use Prisma migrations for schema changes
- Prisma Client is generated to custom location
- Use Decimal type for monetary values
- Maintain data isolation via userId filters

**Frontend:**
- Use standalone components (default in Angular 21)
- Use signals for state, not NgRx
- All API calls require `withCredentials: true`
- Lazy load all route components

**API Response Format:**
- Success responses return data directly or with standard structure
- Errors throw NestJS HttpException with appropriate status codes
- Swagger decorators document all endpoints
