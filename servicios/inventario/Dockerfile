FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install exceljs
RUN npm install jsonwebtoken
COPY . .
EXPOSE 3001
CMD ["node", "src/app.js"]
