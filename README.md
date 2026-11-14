# 🚀 HackathonNasa

> NASA Hackathon Project — React + TypeScript · Node/Express + TypeScript · Docker

## Stack

| Layer    | Technology                       |
|----------|----------------------------------|
| Frontend | React 19 · TypeScript · Vite     |
| Backend  | Node.js · Express 5 · TypeScript |
| Infra    | Docker · docker-compose          |

## Quick Start

```bash
# 1. Clone & enter
git clone <repo> && cd HackathonNasa

# 2. Start dev environment (hot-reload)
make dev

# 3. Open in browser
#   Frontend → http://localhost:5173
#   Backend  → http://localhost:3000
```

## Make targets

| Command        | Description                        |
|----------------|------------------------------------|
| `make dev`     | Start dev environment (hot-reload) |
| `make build`   | Build production Docker images     |
| `make up`      | Start production environment       |
| `make down`    | Stop environment                   |
| `make logs`    | Tail all logs                      |
| `make logs-be` | Tail backend logs                  |
| `make logs-fe` | Tail frontend logs                 |
| `make shell-be`| Shell into backend container       |
| `make clean`   | Remove all containers & images     |
| `make install` | Install deps locally               |

## Project Structure

```
HackathonNasa/
├── Makefile
├── docker-compose.yml        # Production
├── docker-compose.dev.yml    # Development (hot-reload)
├── .env.example
├── frontend/                 # React + TypeScript (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── assets/
│   ├── Dockerfile            # Production (nginx)
│   └── Dockerfile.dev        # Development (vite dev server)
└── backend/                  # Node.js + Express + TypeScript
    ├── src/
    │   ├── routes/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── services/
    │   └── types/
    ├── Dockerfile
    └── Dockerfile.dev
```

