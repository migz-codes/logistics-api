FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .

ENV DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=dummy"
RUN npx prisma generate
RUN npm run build && ls -la dist/

# Production
FROM node:22-alpine
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated

EXPOSE 3000

CMD ["node", "dist/src/main"]
