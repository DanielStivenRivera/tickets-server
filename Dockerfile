# Usa una imagen base de Node.js
FROM node:20

# Instala netcat para el script de health check
RUN apt-get update && apt-get install -y netcat-traditional

# El resto del Dockerfile permanece igual...
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh
CMD ["./docker-entrypoint.sh"]