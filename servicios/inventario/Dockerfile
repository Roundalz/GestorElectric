FROM node:18.20.2-bullseye
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install exceljs
COPY . .
EXPOSE 3001
CMD ["node", "src/app.js"]
