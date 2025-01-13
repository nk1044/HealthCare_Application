FROM node:slim

WORKDIR /app

COPY package*.json ./

RUN npm install

# COPY .env /app/.env # this is only for testing purposes
COPY index.js /app/index.js
COPY app.js /app/app.js
COPY src /app/src

EXPOSE 9000
EXPOSE 3000
EXPOSE 10000

CMD ["npm", "run", "start"]