# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the app (if needed)
# RUN npm run build

# Expose the app port
EXPOSE 5000

# Start the app
CMD ["npm", "run", "dev"]