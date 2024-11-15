# Use the official Node.js image
FROM node:lts

# Set the working directory
WORKDIR /orders

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the service will run on
EXPOSE 9000

# Start the service
CMD ["node", "orders.js"]
