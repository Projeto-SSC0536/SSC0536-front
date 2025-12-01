FROM node:20-bullseye

WORKDIR /usr/src/app

# Install deps based on package-lock for repeatability
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Vite default dev port
EXPOSE 5173

# Helpful for file watching when using mounted volumes
ENV CHOKIDAR_USEPOLLING=true

# Start vite bound to 0.0.0.0 so it's reachable from the host
CMD ["sh","-c","npm run dev -- --host 0.0.0.0"]
