# Production Multi-Stage Dockerfile for Dime API (Root Context)
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9.15.9

# Copy backend package files
COPY backend/package.json backend/tsconfig.json ./

# Install all dependencies (including dev)
RUN pnpm install --frozen-lockfile=false

# Copy backend source code
COPY backend/src ./src

# Compile TypeScript
RUN pnpm run build

# Stage 2: Minimal Production Image
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Install pnpm
RUN npm install -g pnpm@9.15.9

COPY backend/package.json ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile=false

# Copy compiled files from builder
COPY --from=builder /app/dist ./dist

# Non-root secure user
USER node

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["node", "dist/index.js"]

