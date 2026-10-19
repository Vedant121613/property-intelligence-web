# ========================================================
# Pureframe Unified Production Dockerfile (Optimized for Coolify)
# Stage 1: Build React/Vite Frontend
# Stage 2: Node.js 22 LTS Production Server (Serving SPA & API)
# ========================================================

# --- Stage 1: Build Frontend Assets ---
FROM node:22-alpine AS frontend-builder
WORKDIR /build

# Ensure dev dependencies (Vite) are installed even if Coolify passes NODE_ENV=production
ENV NODE_ENV=development

# Copy root frontend package files
COPY package*.json ./
RUN npm ci --include=dev

# Copy frontend source code
COPY index.html ./
COPY vite.config.js ./
COPY public ./public
COPY src ./src

# Build static bundle into /build/dist
RUN npm run build

# --- Stage 2: Production Server Runner ---
FROM node:22-alpine AS runner
WORKDIR /app

# Install backend production dependencies deterministically
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

# Copy backend source code and SQL schema
COPY server ./server

# Copy compiled frontend from Stage 1 into both root and server directories
COPY --from=frontend-builder /build/dist ./dist
COPY --from=frontend-builder /build/dist ./server/dist

# Production environment defaults
ENV NODE_ENV=production
ENV PORT=5000
ENV SINGLE_USER_NAME=user@123
ENV SINGLE_USER_PASS=pass@123

# Install curl & wget for Coolify container healthcheck
RUN apk add --no-cache curl wget

# Expose HTTP port
EXPOSE 5000

# Container healthcheck (fast check with curl / wget)
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=5 \
  CMD curl -f http://127.0.0.1:5000/api/health || wget -qO- http://127.0.0.1:5000/api/health || exit 1

# Start application server
CMD ["node", "server/index.js"]
