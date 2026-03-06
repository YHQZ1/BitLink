# Use lightweight Node image
FROM node:18-alpine

# Set environment for production
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy dependency manifests first (better Docker layer caching)
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

# Copy application source
COPY . .

# Ensure no secrets accidentally ship with the image
RUN rm -f bitlink-key.pem || true

# Expose API port
EXPOSE 3000

# Start the API (which also starts the worker in production)
CMD ["node", "server.js"]