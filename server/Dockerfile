# Build stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Expose port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
