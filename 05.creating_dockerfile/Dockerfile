# Base image
FROM node:20-alpine3.18

# Set a working directory
WORKDIR /app

# Copy dependency file
COPY package\*.json ./

# Install dependency
RUN npm install

# Copy rest of project files
COPY . .

#
EXPOSE 8001

# Start the app
CMD [ "npm", "start" ]

