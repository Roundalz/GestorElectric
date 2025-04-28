FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install http-proxy-middleware
COPY . .
EXPOSE 5000
CMD ["node", "src/app.js"]
