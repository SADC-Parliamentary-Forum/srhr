# SRHR Portal — SADC Parliamentary Forum

A parliamentary governance platform for tracking SRHR (Sexual and Reproductive Health Rights) indicators, reporting, and evidence across 16 SADC member states.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + React 19 + Tailwind CSS v4 |
| Backend | Laravel 11 + PHP 8.3 + Sanctum API auth |
| Database | PostgreSQL 16 |
| Cache / Queue | Redis 7 |
| File Storage | MinIO (S3-compatible) |
| Reverse Proxy | Nginx |
| Container | Docker Compose |

## Quick Start

```bash
# Clone and start
git clone https://github.com/SADC-Parliamentary-Forum/srhr.git
cd srhr
docker-compose up -d

# Seed the database
docker-compose exec backend php artisan migrate:fresh --seed --force
docker-compose exec backend php artisan permission:cache-reset
```

Open [http://localhost](http://localhost) in your browser.

## Login Credentials

| User | Email | Password | Role |
|------|-------|----------|------|
| Ronald Windwaai | ronald@sadc-pf.org | Password123! | Super Admin |
| Jane Mwangi | jane@sadc-pf.org | Password123! | M&E Officer |
| Grace Mutahi | grace@sadc-pf.org | Password123! | Country Reviewer |

## Project Structure

```
srhr/
├── frontend/          # Next.js application
│   └── src/
│       ├── app/
│       │   ├── (auth)/        # Login / register
│       │   ├── (public)/      # Public site
│       │   └── portal/        # Authenticated portal
│       ├── components/        # Shared UI components
│       └── lib/               # API client, auth helpers
├── backend/           # Laravel API
│   ├── app/Http/Controllers/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
├── designs/           # Approved design screens (.html + .png)
│   ├── Portal/        # Public portal designs
│   └── LoggedinScreens/  # Authenticated portal designs
└── docker-compose.yml
```

## API Endpoints

### Auth
```
POST /api/auth/login                   Sign in, returns Bearer token
POST /api/auth/register-request        Request portal access
GET  /api/auth/me                      Current user profile
POST /api/auth/logout                  Invalidate token
```

### Public
```
GET /api/public/dashboard              Regional SRHR overview
GET /api/public/countries              16 SADC member states
GET /api/public/countries/{slug}       Country detail + indicators
GET /api/public/reports                Public published reports
```

### Portal (authenticated)
```
GET    /api/portal/dashboard           User dashboard KPIs + activity
GET    /api/portal/reports             Reports list
POST   /api/portal/reports             Create new report
GET    /api/portal/reports/{id}        Report detail
PUT    /api/portal/reports/{id}        Update report
PATCH  /api/portal/reports/{id}/status Change status (draft→submitted→review→approved→published)
DELETE /api/portal/reports/{id}        Delete report
GET    /api/portal/indicators          Indicators list
POST   /api/portal/indicators          Add indicator
GET    /api/portal/evidence            Evidence list
POST   /api/portal/evidence            Upload evidence with files
GET    /api/portal/evidence/metadata   Form metadata (countries, periods, types)
```

### Admin
```
GET   /api/admin/users                     List all users
PUT   /api/admin/users/{id}                Update user
PATCH /api/admin/users/{id}/status         Toggle active/inactive
POST  /api/admin/access-requests/{id}/approve  Approve access request
GET   /api/admin/audit-logs                Last 100 audit log entries
GET   /api/admin/configuration             System configuration
PUT   /api/admin/configuration             Update configuration
```

## Roles

| Role | Permissions |
|------|------------|
| super_admin | All permissions |
| secretariat | View, create, review, approve, export |
| programme_manager | View, create, submit, use AI |
| me_officer | Upload indicators, create reports, use AI |
| finance_officer | Upload budget, export |
| country_reviewer | View dashboard, review reports |
| srhr_researcher | View, use AI |
| communications_user | View, publish public content |
| partner_viewer | View public data only |

## Docker Services

| Service | Port | Description |
|---------|------|-------------|
| nginx | 80 | Reverse proxy |
| frontend | 3000 | Next.js dev server |
| backend | 8000 (internal) | Laravel API |
| postgres | 5432 | Database |
| redis | 6379 | Cache + queues |
| minio | 9000, 9002 | File storage (console on 9002) |

## Development

```bash
# View logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Run artisan commands
docker-compose exec backend php artisan <command>

# Reset database
docker-compose exec backend php artisan migrate:fresh --seed --force
docker-compose exec backend php artisan permission:cache-reset

# TypeScript check
docker-compose exec frontend npm run build
```
