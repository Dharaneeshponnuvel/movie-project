# Base image for Node.js
FROM node:16

# Set working directory inside the container
WORKDIR /app/backend

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend files to the container
COPY backend .

# Expose port for backend service
EXPOSE 5000

# Run the application
CMD ["node", "server.js"]
