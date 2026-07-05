#!/bin/bash

CONTAINER_ID=6d99d1505f72  # postgres container required 

#check docker exist  
ret_length=$(docker ps | awk '{print $2}' | sed '1d' | grep "postgres" | wc -m | xargs ) # pipe to xargs removes white space 
echo "$ret_length"

if (( "$ret_length" > 0 )); then 
    echo "";
else 
    # start instance ( installs postgress to shell )

    # name - name of container 
    # e - environmental variable 
    # d - detach mode (sql is a background process)
    docker run --name nba-pg  -e POSTGRES_PASSWORD=password -d postgres
fi

# mkdir in postgres container (shell)

# -p (make parents if needed)
docker exec  "${CONTAINER_ID}" mkdir -p /root/work

# copy .sql script into container 
docker cp ./pgfiles/index.sql "${CONTAINER_ID}":/root/work/index.sql

# copy  scripts into container 
docker cp ./pgfiles/createdb.sh "${CONTAINER_ID}":/root/work/createdb.sh
docker cp ./pgfiles/copyteams.sh "${CONTAINER_ID}":/root/work/copyteams.sh
docker cp ./pgfiles/copyplayers.sh "${CONTAINER_ID}":/root/work/copyplayers.sh
docker cp ./pgfiles/copyraces.sh "${CONTAINER_ID}":/root/work/copyraces.sh

# copy csv files 
docker cp ./pgfiles/nbateams.csv "${CONTAINER_ID}":/root/work/nbateams.csv
docker cp ./pgfiles/nba.csv "${CONTAINER_ID}":/root/work/nba.csv
docker cp ./pgfiles/race.csv "${CONTAINER_ID}":/root/work/race.csv

# add/run script to container 
stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/createdb.sh)
if (( $? == 0 )); then 
    # move files to tmp if database created 
    docker exec  "${CONTAINER_ID}" mv  /root/work/createdb.sh /tmp
fi 

# load .sql file (create tables)
docker exec "${CONTAINER_ID}" psql -U postgres -f /root/work/index.sql

# add/run script to container 
stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/copyteams.sh);
echo $stdout

# add/run script to container 
stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/copyplayers.sh)
echo $stdout

# add/run script to container 
stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/copyraces.sh)
echo $stdout

