# Use Node.js as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy root package files if they existed, but since they don't, we'll copy subdirectories
# Copy backend first to get dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy frontend to get dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy all source code
COPY . .

# Build Frontend
RUN cd frontend && npm run build

# Build Backend
RUN cd backend && npx prisma generate && npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Run migrations and start the server
# We use a shell command to ensure prisma migrations run before startup
CMD cd backend && npx prisma db push && npm start
