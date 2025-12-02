FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Install fonts for better PDF rendering
RUN apk add --no-cache \
    fontconfig \
    msttcorefonts-installer \
    chromium \
  && update-ms-fonts \
  && fc-cache -f

# We use @sparticuz/chromium which needs this env var to know where chromium is if we want to use system chromium
# But @sparticuz/chromium usually bundles it or downloads it.
# However, for Alpine, it's often better to use the installed chromium.
# Let's check the spec. Spec says: "Works on Linux (Docker, Fly.io, Render, etc.)"
# And uses @sparticuz/chromium.
# @sparticuz/chromium is designed for AWS Lambda but works elsewhere.
# It usually requires a specific setup.
# Let's stick to the spec's Dockerfile but adapt for the build step since we are using TS.
# The spec's Dockerfile copied . . and ran node dist/server.js.
# It assumed the code was already built or it was JS.
# Since we have TS, we need to build.
# I added `RUN npm run build` above.
# Also, I need to make sure devDependencies are available for the build step.
# `npm ci --only=production` skips devDeps.
# So I should install all deps, build, then prune or just use multi-stage build.
# For simplicity and speed (under 1 day), I'll just install all deps.
# Or better:
# FROM node:20-alpine as builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build
#
# FROM node:20-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci --only=production
# COPY --from=builder /app/dist ./dist
# ... install fonts ...

# Let's go with a simpler approach first, just install all deps.
# The image size might be slightly larger but it's fine for MVP.
# Actually, `npm ci` installs everything.
# Then I can prune.

# Revised Dockerfile based on spec + TS needs
FROM node:20-alpine

WORKDIR /app

# Install dependencies including devDependencies for building
COPY package*.json ./
RUN npm ci

COPY . .

# Build the TypeScript code
RUN npm run build

# Prune dev dependencies to save space (optional but good)
RUN npm prune --production

# Install fonts and chromium dependencies if needed
# @sparticuz/chromium might need some libs.
# The spec Dockerfile installs fonts.
RUN apk add --no-cache \
    fontconfig \
    msttcorefonts-installer \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
  && update-ms-fonts \
  && fc-cache -f

# Tell Puppeteer to use the installed Chromium if we want, OR rely on @sparticuz/chromium
# @sparticuz/chromium is specifically for serverless/lambda but works in docker if configured.
# However, standard puppeteer + installed chromium is often more stable on standard Docker.
# But the spec explicitly requested @sparticuz/chromium.
# I will stick to the spec's recommendation.

EXPOSE 3000
CMD ["node", "dist/server.js"]
