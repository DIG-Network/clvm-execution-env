# Use an official Ubuntu base image
FROM ubuntu:20.04

# Set environment variables for non-interactive installs
ENV DEBIAN_FRONTEND=noninteractive

# Update the package list and install basic tools
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev \
    python3-pip \
    python3-venv \
    lsb-release \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Verify Node.js and npm installation
RUN node -v && npm -v

# Install Chia Dev Tools from PyPI globally so 'run' and 'brun' are available system-wide
RUN python3 -m pip install --upgrade pip && \
    python3 -m pip install --extra-index-url https://pypi.chia.net/simple/ chia-dev-tools

# Set working directory to /usr/src/app for the Express app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install npm dependencies for the Express server
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the necessary ports for Chia and the Express server
EXPOSE 8444 8555 3000

# Command to start the Express server
CMD ["npm", "start"]
