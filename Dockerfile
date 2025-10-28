# Multi-stage build untuk optimasi ukuran image

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy workspace packages
COPY packages ./packages

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Note: .env file should be created by Jenkins before build with:
COPY .env.prod .env
# The .env file will be automatically copied and used by Vite during build

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config untuk SPA routing
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
