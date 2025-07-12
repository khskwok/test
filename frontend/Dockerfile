FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Set environment variable for API URL
ENV REACT_APP_API_URL=http://localhost:8000

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]