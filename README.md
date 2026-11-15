# 🚀 HackathonNasa

> NASA Hackathon Project — React + TypeScript · Node/Express + TypeScript · PostgreSQL (Drizzle ORM) · Docker

## Stack

| Layer      | Technology                       |
|------------|----------------------------------|
| Frontend   | React 19 · TypeScript · Vite     |
| Backend    | Node.js · Express 5 · TypeScript |
| Database   | PostgreSQL · Drizzle ORM · Redis |
| Infra      | Docker · docker-compose          |


```bash
# 1. Clone & enter
git clone <repo> && cd HackathonNasa

# 2. Start dev environment (hot-reload)
make dev

# 3. Open in browser
#    Frontend       → http://localhost:5173
#    Backend        → http://localhost:3000
#    Drizzle Studio → Run `make studio`

```

## Make targets

| Command | Description |
| --- | --- |
| `make dev` | Start dev environment in background and tail logs |
| `make dev-build` | Rebuild from scratch (no cache) and start environment |
| `make dev-down` | Stop development environment |
| `make fresh` | Complete cross-platform reset (Clean volumes, node_modules & rebuild) |
| `make migrate` | Run database migrations (Dev backend) |
| `make studio` | Open Drizzle Studio (Database GUI) |
| `make db-reset` | Reset database completely (Drop data, recreate volume & migrate) |
| `make build` | Build production Docker images |
| `make up` | Start production environment |
| `make down` | Stop production environment |
| `make status` | Show running containers status |
| `make logs` | Tail all container logs |
| `make logs-be` | Tail backend logs |
| `make logs-fe` | Tail frontend logs |
| `make shell-be` | Open interactive shell in backend container |
| `make shell-fe` | Open interactive shell in frontend container |
| `make shell-db` | Open PostgreSQL psql console |
| `make clean` | Deep clean all Docker containers, images, and dependencies |
| `make install` | Install dependencies locally on host machine |

```

```
