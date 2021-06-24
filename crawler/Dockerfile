# Crawler-app
FROM node:alpine

RUN npm install -g npm@7.18.1
WORKDIR /home/robert/LegoCollectionManager/crawler/
COPY ./package.json ./

RUN npm install
COPY ./ ./

CMD ["node", "schedule.js"]