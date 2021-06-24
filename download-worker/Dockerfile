# Downloadworker
FROM node:alpine

RUN npm install -g npm@7.18.1
WORKDIR /home/robert/LegoCollectionManager/download-worker/

COPY ./package.json ./
RUN npm install

COPY ./ ./
CMD ["npm", "start"]