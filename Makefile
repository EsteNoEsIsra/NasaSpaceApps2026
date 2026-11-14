.DEFAULT_GOAL := help
COMPOSE        = docker compose
COMPOSE_DEV    = docker compose -f docker-compose.dev.yml

##@ Help
.PHONY: help
help:  ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development
.PHONY: dev
dev: ## Start dev environment (hot-reload)
	cp -n .env.example .env 2>/dev/null || true
	$(COMPOSE_DEV) up --build

.PHONY: dev-down
dev-down: ## Stop dev environment
	$(COMPOSE_DEV) down

.PHONY: restart
restart: ## Restart dev environment containers
	$(COMPOSE_DEV) restart

##@ Database
.PHONY: migrate
migrate: ## Run database migrations
	$(COMPOSE_DEV) exec backend npm run db:migrate

.PHONY: migrate-prod
migrate-prod: ## Run migrations in production
	$(COMPOSE) exec backend npm run db:migrate

.PHONY: studio
studio: ## Open Drizzle Studio (DB GUI)
	$(COMPOSE_DEV) exec backend npm run db:studio

.PHONY: db-reset
db-reset: ## Drop & recreate DB volume, start backend & run migrations (⚠ destroys data)
	$(COMPOSE_DEV) down -v
	$(COMPOSE_DEV) up -d db redis
	@echo "⏳ Waiting for database to be healthy..."
	@sleep 4
	$(COMPOSE_DEV) up -d backend
	@echo "⏳ Waiting for backend container to stabilize..."
	@sleep 3
	$(COMPOSE_DEV) exec backend npm run db:migrate
	@echo "✅ Database successfully reset and migrated!"

##@ Production
.PHONY: build
build: ## Build production images
	$(COMPOSE) build

.PHONY: up
up: ## Start production environment
	cp -n .env.example .env 2>/dev/null || true
	$(COMPOSE) up -d

.PHONY: down
down: ## Stop production environment
	$(COMPOSE) down

##@ Utilities
.PHONY: logs
logs: ## Tail all container logs
	$(COMPOSE_DEV) logs -f

.PHONY: logs-be
logs-be: ## Tail backend logs
	$(COMPOSE_DEV) logs -f backend

.PHONY: logs-fe
logs-fe: ## Tail frontend logs
	$(COMPOSE_DEV) logs -f frontend

.PHONY: logs-db
logs-db: ## Tail DB logs
	$(COMPOSE_DEV) logs -f db

.PHONY: shell-be
shell-be: ## Open shell in backend container
	$(COMPOSE_DEV) exec backend sh

.PHONY: shell-fe
shell-fe: ## Open shell in frontend container
	$(COMPOSE_DEV) exec frontend sh

.PHONY: shell-db
shell-db: ## Open psql in DB container
	$(COMPOSE_DEV) exec db psql -U nasa -d hackathon

.PHONY: shell-redis
shell-redis: ## Open redis-cli
	$(COMPOSE_DEV) exec redis redis-cli -a redis_secret

.PHONY: clean
clean: ## Remove containers, volumes and images completely
	$(COMPOSE) down -v --rmi all --remove-orphans
	$(COMPOSE_DEV) down -v --rmi all --remove-orphans

.PHONY: install
install: ## Install deps locally (outside Docker)
	cd frontend && npm install
	cd backend && npm install