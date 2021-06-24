# Database
FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=1234
ENV MYSQL_USER: WebDBUser
ENV MYSQL_PASSWORD: qF2J%9a84zU

COPY ./dumps/legosorter_dumb_latest.sql /docker-entrypoint-initdb.d/
COPY ./legosorter_initalise_user.sql /docker-entrypoint-initdb.d/
