# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port (sẽ tùy chỉnh cho từng service)
EXPOSE 3000

# Start service
CMD ["node", "index.js"]
