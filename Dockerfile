# ==============================================================================
# V.E.N.U.S. Multi-stage Dockerfile for NASA Space Apps
# Stage 1: Development with Vite HMR
# Stage 2: Production Build with Nginx
# ==============================================================================

# Base image with Node 20 Alpine for minimal footprint and maximum speed
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# ------------------------------------------------------------------------------
# Development target: runs Vite with HMR and polling
# ------------------------------------------------------------------------------
FROM base AS dev
WORKDIR /app
COPY . .
EXPOSE 5173
ENV HOST=0.0.0.0
CMD ["npm", "run", "dev"]

# ------------------------------------------------------------------------------
# Production target: compiles bundle and serves with lightweight Nginx
# ------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
