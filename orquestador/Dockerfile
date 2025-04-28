FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install http-proxy-middleware
RUN npm install node-fetch
COPY . .
EXPOSE 5000
CMD ["node", "src/app.js"]
