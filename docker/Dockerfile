FROM node:latest

USER node
WORKDIR /home/node

COPY index.js .
COPY package.json .
COPY tls.key .
COPY tls.crt .

RUN npm install

CMD node index.js
