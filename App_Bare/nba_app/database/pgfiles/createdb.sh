#!/bin/bash

# Script create sports db
DATABASE_NAME=sport_db
 
resp=$(psql -U postgres -lqt | awk '{print $1}' | grep "${DATABASE_NAME}" | xargs)
 
 
 if [[ "$resp" == "" ]]; then 

    psql -U postgres <<< "select 'create database ${DATABASE_NAME}' where not exists(select from pg_database where datname = '${DATABASE_NAME}') \gexec"
    
     echo "create database"

 else 

    exit 1

 fi 

exit 0