# Use the official Node.js image.
FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the application.
RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "start" ]

# Expose the port the app runs on
EXPOSE 3000