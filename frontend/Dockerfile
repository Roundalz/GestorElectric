# ───────────────────────────────────────────────────────────────
# Stage 1: Build con Node 20 (alpine) y npm configurado
# ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Ajustes de npm para tolerar engines y reintentos en caso de fallos de red
RUN npm config set engine-strict false \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-factor 2 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000

# Copiamos lockfiles e instalamos dependencias de una sola pasada
COPY package.json package-lock.json ./
# Incluimos todas tus librerías adicionales aquí
RUN npm install qrcode.react react-barcode exceljs \
 && npm install

# Copiamos el resto de tu código y generamos el bundle
COPY . .
RUN npm run build


# ───────────────────────────────────────────────────────────────
# Stage 2: Runtime con Nginx
# ───────────────────────────────────────────────────────────────
FROM nginx:alpine

# Servimos la carpeta dist resultante
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
