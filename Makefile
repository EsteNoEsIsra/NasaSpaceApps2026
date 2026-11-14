.DEFAULT_GOAL := help
COMPOSE       = docker compose
COMPOSE_DEV   = docker compose -f docker-compose.dev.yml

##@ 🛠️  Development & Environment
.PHONY: help
help: ## Show this detailed help menu
	@printf "\033[1m\033[36m🚀 NASA HACKATHON - CONTROL PANEL\033[0m\n\n"
	@printf "\033[1m\033[33m🛠️  Development & Environment\033[0m\n"
	@printf "  \033[32mdev\033[0m              Start dev environment in background and tail logs\n"
	@printf "  \033[32mdev-build\033[0m      Rebuild from scratch (no cache) and start environment\n"
	@printf "  \033[32mdev-down\033[0m       Stop development environment\n"
	@printf "  \033[32mfresh\033[0m          Complete cross-platform reset (Clean volumes, node_modules & rebuild)\n\n"
	@printf "\033[1m\033[33m🗄️  Database & Migrations\033[0m\n"
	@printf "  \033[32mmigrate\033[0m        Run database migrations (Dev backend)\n"
	@printf "  \033[32mstudio\033[0m         Open Drizzle Studio (Database GUI)\n"
	@printf "  \033[32mdb-reset\033[0m       Reset database completely (Drop data, recreate volume & migrate)\n\n"
	@printf "\033[1m\033[33m🚢 Production\033[0m\n"
	@printf "  \033[32mbuild\033[0m          Build production Docker images\n"
	@printf "  \033[32mup\033[0m             Start production environment\n"
	@printf "  \033[32mdown\033[0m           Stop production environment\n\n"
	@printf "\033[1m\033[33m🔍 Utilities & Monitoring\033[0m\n"
	@printf "  \033[32mstatus\033[0m         Show running containers status\n"
	@printf "  \033[32mlogs\033[0m           Tail all container logs\n"
	@printf "  \033[32mlogs-be\033[0m        Tail backend logs\n"
	@printf "  \033[32mlogs-fe\033[0m        Tail frontend logs\n"
	@printf "  \033[32mshell-be\033[0m       Open interactive shell in backend container\n"
	@printf "  \033[32mshell-fe\033[0m       Open interactive shell in frontend container\n"
	@printf "  \033[32mshell-db\033[0m       Open PostgreSQL psql console\n"
	@printf "  \033[32mclean\033[0m          Deep clean all Docker containers, images, and dependencies\n"
	@printf "  \033[32minstall\033[0m        Install dependencies locally on host machine\n"

.PHONY: dev
dev:
	@echo "⚙️ Setting up environment variables..."
	@cp -n .env.example .env 2>/dev/null || true
	@echo "🐳 Starting Docker containers (Dev)..."
	$(COMPOSE_DEV) up -d
	@echo "📋 Tailing live logs (Ctrl+C to exit without stopping)..."
	$(COMPOSE_DEV) logs -f

.PHONY: dev-build
dev-build:
	@echo "🧹 Cleaning cache and rebuilding images..."
	@cp -n .env.example .env 2>/dev/null || true
	$(COMPOSE_DEV) build --no-cache
	$(COMPOSE_DEV) up -d
	$(COMPOSE_DEV) logs -f

.PHONY: dev-down
dev-down:
	@echo "🛑 Stopping development services..."
	$(COMPOSE_DEV) down

.PHONY: fresh
fresh:
	@echo "🔥 Executing full cross-platform reset for device switch..."
	$(COMPOSE_DEV) down -v --rmi all --remove-orphans
	docker volume rm -f hackathonnasa_frontend_node_modules hackathonnasa_backend_node_modules 2>/dev/null || true
	@echo "📦 Rebuilding clean containers..."
	$(COMPOSE_DEV) build --no-cache
	$(COMPOSE_DEV) up -d
	$(COMPOSE_DEV) logs -f

.PHONY: migrate
migrate:
	@echo "🔄 Running database migrations..."
	$(COMPOSE_DEV) exec backend npm run db:migrate

.PHONY: studio
studio:
	@echo "🎨 Opening Drizzle Studio..."
	$(COMPOSE_DEV) exec backend npm run db:studio

.PHONY: db-reset
db-reset:
	@echo "⚠️ Dropping database volume..."
	$(COMPOSE_DEV) down -v postgres_data
	$(COMPOSE_DEV) up -d db redis
	@echo "⏳ Waiting for PostgreSQL to be ready..."
	@until $(COMPOSE_DEV) exec db pg_isready -U nasa -d hackathon; do sleep 1; done
	$(COMPOSE_DEV) up -d backend
	@echo "⏳ Waiting for backend container..."
	@sleep 3
	$(COMPOSE_DEV) exec backend npm run db:migrate
	@echo "✅ Database successfully reset and migrated!"

.PHONY: build
build:
	@echo "🏗️ Building production images..."
	$(COMPOSE) build

.PHONY: up
up:
	@cp -n .env.example .env 2>/dev/null || true
	$(COMPOSE) up -d

.PHONY: down
down:
	$(COMPOSE) down

.PHONY: status
status:
	$(COMPOSE_DEV) ps

.PHONY: logs
logs:
	$(COMPOSE_DEV) logs -f

.PHONY: logs-be
logs-be:
	$(COMPOSE_DEV) logs -f backend

.PHONY: logs-fe
logs-fe:
	$(COMPOSE_DEV) logs -f frontend

.PHONY: shell-be
shell-be:
	$(COMPOSE_DEV) exec backend sh

.PHONY: shell-fe
shell-fe:
	$(COMPOSE_DEV) exec frontend sh

.PHONY: shell-db
shell-db:
	$(COMPOSE_DEV) exec db psql -U nasa -d hackathon

.PHONY: clean
clean:
	@echo "🧹 Deep cleaning project Docker environment..."
	$(COMPOSE) down -v --rmi all --remove-orphans
	$(COMPOSE_DEV) down -v --rmi all --remove-orphans
	docker volume rm -f hackathonnasa_frontend_node_modules hackathonnasa_backend_node_modules 2>/dev/null || true
	@echo "✨ Cleanup completed successfully!"

.PHONY: install
install:
	@echo "💻 Installing local dependencies in frontend and backend..."
	cd frontend && npm install
	cd backend && npm install