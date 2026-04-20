# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Pass build-time env vars if needed. Vite picks them up from .env files or process.env
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Cloud Run requires listening on $PORT
# We use a shell script to replace the port in nginx config at runtime
CMD ["/bin/sh", "-c", "sed -i 's/LISTEN_PORT/'\"$PORT\"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
