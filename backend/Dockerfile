# Backend-app
FROM node:alpine

RUN npm install -g npm@7.18.1
WORKDIR /home/robert/LegoCollectionManager/backend/
COPY ./package.json ./

RUN npm install
COPY ./ ./

CMD ["npm", "start"]