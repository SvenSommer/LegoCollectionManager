FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=1234

COPY ./sqldatabase/legosorter_dumb_20210405_DataIncluded_NewScheme.sql /docker-entrypoint-initdb.d/
