# Dockerfile for books, customers, and orders services

# Use the official Node.js image
FROM node:lts

# Create and set working directory
WORKDIR /customers

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the service will run on
EXPOSE 5000

# Start the service
CMD ["node", "customers.js"] 
