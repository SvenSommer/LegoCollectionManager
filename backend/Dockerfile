FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=1234

COPY ./sqldatabase/legosorter_dumb_20210503.sql /docker-entrypoint-initdb.d/
