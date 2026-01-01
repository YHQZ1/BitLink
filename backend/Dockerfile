FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests first (enables layer caching)
COPY package.json package-lock.json ./

# Install only production dependencies, deterministically
RUN npm ci --only=production

# Copy application source code
COPY . .

# Safety net: ensure secrets are never baked into the image
RUN rm -f bitlink-key.pem || true

# Expose backend port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
