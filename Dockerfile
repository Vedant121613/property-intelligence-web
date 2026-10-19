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

# Expose HTTP port
EXPOSE 5000

# Container healthcheck (uses Node 22 native fetch and checks dynamic PORT)
HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "const port = process.env.PORT || 5000; fetch('http://127.0.0.1:' + port + '/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Start application server
CMD ["node", "server/index.js"]
