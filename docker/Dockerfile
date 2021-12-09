FROM node:current-alpine3.12

USER node
WORKDIR /home/node

COPY index.js .
COPY package.json .

RUN npm install

CMD node index.js
