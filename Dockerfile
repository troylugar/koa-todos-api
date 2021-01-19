FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY src ./src
EXPOSE 3000
CMD [ "node", "src/server.js" ]
