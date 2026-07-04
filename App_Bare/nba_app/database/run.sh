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
docker cp ./index.sql "${CONTAINER_ID}":/root/work/index.sql

# copy create db script into container 
docker cp ./pgfiles/createdb.sh "${CONTAINER_ID}":/root/work/createdb.sh

# add/run script to container 
stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/createdb.sh)
if (( $? == 0 )); then 
    # move files to tmp if database created 
    docker exec  "${CONTAINER_ID}" mv  /root/work/createdb.sh /tmp
fi 

# load .sql file (create tables)
docker exec "${CONTAINER_ID}" psql -U postgres -f /root/work/index.sql






# does nba_db exist 
# connect to docker (shell)
# -t tty (allocate shell for client standard input )
# -i interactive 
# -w prompt for password 
# -d run container in background 
# -e environment variables 
# -u USER or USERNAME to access postgres service
# docker exec -it "${CONTAINER_ID}" psql -w -U postgres


