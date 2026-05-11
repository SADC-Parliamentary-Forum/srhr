.PHONY: up down restart build logs shell-backend shell-frontend test test-backend test-frontend test-e2e migrate seed fresh

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

build:
	docker compose build

logs:
	docker compose logs -f

shell-backend:
	docker compose exec backend sh

shell-frontend:
	docker compose exec frontend sh

# Tests
test: test-backend test-frontend

test-backend:
	docker compose exec backend ./vendor/bin/pest

test-frontend:
	docker compose exec frontend npm run test

test-e2e:
	docker compose exec frontend npx playwright test

# Database
migrate:
	docker compose exec backend php artisan migrate

seed:
	docker compose exec backend php artisan db:seed

fresh:
	docker compose exec backend php artisan migrate:fresh --seed

# Artisan shortcuts
artisan:
	docker compose exec backend php artisan $(cmd)

# npm shortcuts
npm:
	docker compose exec frontend npm $(cmd)
