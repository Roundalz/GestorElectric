FROM node:18.20.2-bullseye
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "src/app.js"]
