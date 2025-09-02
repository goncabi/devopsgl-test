# ---- Base Stage ----
# Defines the base node image and workdir
FROM node:18 as base
WORKDIR /app

# ---- Dependencies Stage ----
# Installs all dependencies, including devDependencies for testing
FROM base as dependencies
COPY package*.json ./
RUN npm install

# ---- Build Stage ----
# Copies source, runs tests, and then removes dev dependencies.
FROM dependencies as build
COPY . .
RUN npm test
RUN npm prune --production

# ---- Runner Stage ----
# This stage creates the final, smaller, and more secure image
FROM node:18-slim
RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid 1001 nodejs
WORKDIR /app
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./
COPY --from=build --chown=nodejs:nodejs /app/index.js ./
USER nodejs
EXPOSE 8080
CMD ["npm", "start"]