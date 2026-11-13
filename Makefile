# ==============================================================================
# V.E.N.U.S. — NASA Space Apps Challenge Automation Makefile
# Visual Engine for Neuro-endocrine & Universal Systems
# ==============================================================================

.PHONY: help install dev build preview up down logs restart docker-build docker-up docker-down docker-logs clean

# Default target
.DEFAULT_GOAL := help

# Colors for terminal output
BLUE   := \033[36m
GREEN  := \033[32m
YELLOW := \033[33m
RED    := \033[31m
RESET  := \033[0m

help: ## Show this help message
	@echo ""
	@echo "$(BLUE)══════════════════════════════════════════════════════════════════$(RESET)"
	@echo "$(BLUE)   V.E.N.U.S. - NASA Health Monitoring System Makefile           $(RESET)"
	@echo "$(BLUE)══════════════════════════════════════════════════════════════════$(RESET)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-18s$(RESET) %s\n", $$1, $$2}'
	@echo ""

# ------------------------------------------------------------------------------
# Local Development Targets
# ------------------------------------------------------------------------------

install: ## Install dependencies on local machine
	@echo "$(BLUE)📦 Installing node dependencies...$(RESET)"
	npm install

dev: ## Run Vite development server locally on port 5173
	@echo "$(GREEN)🚀 Starting local Vite dev server at http://localhost:5173...$(RESET)"
	npm run dev

build: ## Type-check and compile production bundle to dist/
	@echo "$(BLUE)🛠️ Compiling production build...$(RESET)"
	npm run build
	@echo "$(GREEN)✅ Build complete in ./dist!$(RESET)"

preview: ## Preview the production build locally
	@echo "$(BLUE)👀 Previewing production build...$(RESET)"
	npm run preview

# ------------------------------------------------------------------------------
# Docker Targets (Cross-platform compatibility)
# ------------------------------------------------------------------------------

docker-build: ## Build Docker image using docker-compose
	@echo "$(BLUE)🐳 Building Docker image...$(RESET)"
	docker compose build

up: docker-up ## Alias for docker-up
docker-up: ## Start application container with Docker Compose (hot-reload enabled)
	@echo "$(GREEN)🛸 Launching V.E.N.U.S. container on http://localhost:5173...$(RESET)"
	docker compose up -d
	@echo "$(GREEN)✨ Service is up! Run 'make logs' to watch telemetry output.$(RESET)"

down: docker-down ## Alias for docker-down
docker-down: ## Stop and remove Docker containers
	@echo "$(YELLOW)🛑 Stopping V.E.N.U.S. containers...$(RESET)"
	docker compose down

logs: docker-logs ## Alias for docker-logs
docker-logs: ## Follow live logs from the running Docker container
	docker compose logs -f

restart: ## Restart Docker containers
	@echo "$(YELLOW)🔄 Restarting containers...$(RESET)"
	docker compose restart
	@echo "$(GREEN)✨ Restarted successfully.$(RESET)"

docker-rebuild: ## Clean rebuild of Docker images (no-cache)
	@echo "$(BLUE)🔄 Rebuilding Docker containers from scratch...$(RESET)"
	docker compose build --no-cache
	docker compose up -d

clean: ## Clean node_modules, build artifacts and lockfiles
	@echo "$(RED)🧹 Cleaning build artifacts and cache...$(RESET)"
	rm -rf dist node_modules .vite
	@echo "$(GREEN)✅ Cleaned.$(RESET)"
