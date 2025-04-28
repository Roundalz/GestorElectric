# Usa la imagen de Node.js para construir el frontend
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install qrcode.react
RUN npm install react-barcode
RUN npm install axios react-router-dom jsbarcode
RUN npm install framer-motion lucide-react
RUN npm install lucide-react
RUN npm install exceljs
COPY . .
RUN npm run build

# Usa Nginx para servir la aplicación en producción
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
