FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY *.pem ./
COPY src ./src
RUN npm install pm2 -g
EXPOSE 3000
CMD [ "pm2-runtime", "npm", "--", "start" ]
