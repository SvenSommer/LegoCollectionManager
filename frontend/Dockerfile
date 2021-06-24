FROM node:alpine

#install dependencies
RUN npm install -g npm@6.14.4
WORKDIR /home/robert/LegoCollectionManager/frontend/
COPY ./package.json ./
RUN npm install

COPY ./ ./

CMD ["ng", "serve --host 0.0.0.0 --disable-host-check"]