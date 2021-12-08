FROM node:latest

USER node
WORKDIR /home/node

COPY index.js .
COPY package.json .

RUN npm install

CMD node index.js
