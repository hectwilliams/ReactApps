#!/bin/bash

CONTAINER_ID=""
CONTAINER_NAME=nba-pg

# docker must be installed 
exist=$(whereis docker | awk '{print $2}' | xargs |  wc -m | xargs )

if (( exist == 0 )); then 
    echo "Docker not installed"
    exit 1 
fi 

# docker container running ?
c_id=$(docker ps | awk '{print $2}' | sed '1d' | grep "postgres") # pipe to xargs removes white space 
ret_length=$( echo $c_id | xargs | wc -m | xargs )

if (( $ret_length == 0 )); then 

    # download postgres image (TBD)
    docker pull postgres

    # start container instance ( installs postgress to shell )

    # name - name of container 
    # e - environmental variable 
    # d - detach mode (sql is a background process)
    # p - map container port to localhost port
    ret=$(docker run  -p 5432:5432 --name "${CONTAINER_NAME}"  -e POSTGRES_PASSWORD=password -e DB_USER=htron -e DB_HOST=localhost  -e DB_NAME=sport_db -e DB_PASSWORD=abcd -d postgres  2>&1 )
    
    if [[ "$ret" == *"Error"* ]]; then
        # Error occured, start container 
        id=$(docker images | grep postgres | awk '{print $2}' | xargs)
        # container name already exist 
        docker start $CONTAINER_NAME
    fi 

fi 

# get container id 
CONTAINER_ID=$(docker ps | awk '{print $1}' | sed '1d'| xargs)

# -p ( container -- make parents if needed)
docker exec  "${CONTAINER_ID}" mkdir -p /root/work
docker exec  "${CONTAINER_ID}" mkdir -p /root/work/media/images/players

echo $CONTAINER_ID

# copy .sql script into container 
docker cp ./pgfiles/index0.sql "${CONTAINER_ID}":/root/work/index0.sql
docker cp ./pgfiles/index1.sql "${CONTAINER_ID}":/root/work/index1.sql
docker cp ./pgfiles/createdb.sh "${CONTAINER_ID}":/root/work/createdb.sh
docker cp ./pgfiles/copyteams.sh "${CONTAINER_ID}":/root/work/copyteams.sh
docker cp ./pgfiles/copyraces.sh "${CONTAINER_ID}":/root/work/copyraces.sh

#copy bash script into container 
docker cp ./pgfiles/pageinfo.sh "${CONTAINER_ID}":/root/work/pageinfo.sh
docker cp ./pgfiles/copypts.sh "${CONTAINER_ID}":/root/work/copypts.sh
docker cp ./pgfiles/copyplayed.sh "${CONTAINER_ID}":/root/work/copyplayed.sh
docker cp ./pgfiles/copyplayers.sh "${CONTAINER_ID}":/root/work/copyplayers.sh
docker cp ./pgfiles/copyimages.sh "${CONTAINER_ID}":/root/work/copyimages.sh

# copy csv files  into container 
docker cp ./pgfiles/nbateams.csv "${CONTAINER_ID}":/root/work/nbateams.csv
docker cp ./pgfiles/nba.csv "${CONTAINER_ID}":/root/work/nba.csv
docker cp ./pgfiles/race.csv "${CONTAINER_ID}":/root/work/race.csv
docker cp ./pgfiles/plot_pts.csv "${CONTAINER_ID}":/root/work/plot_pts.csv
docker cp ./pgfiles/plot_played.csv "${CONTAINER_ID}":/root/work/plot_played.csv
docker cp ./pgfiles/images_list.csv "${CONTAINER_ID}":/root/work/images_list.csv

# copy image files to container 
docker cp ./pgfiles/media/images/players  "${CONTAINER_ID}":/root/work/media/images/players                 

# /Users/hectorwilliams/Documents/Dev/repos/ReactApps/App_Bare/nba_app/database/
# cwd=/root/work/media/images/players

# add/run script to container 
stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/createdb.sh)
if (( $? == 0 )); then 
    # move files to tmp if database created 
    # create sport_db database 
    docker exec  "${CONTAINER_ID}" mv  /root/work/createdb.sh /tmp
fi 

# Service admin create database and creates rules 
ADMIN_DB=postgres
docker exec "${CONTAINER_ID}" psql -U "${ADMIN_DB}" -f /root/work/index0.sql

# Service guest (working for sport_db subprime company) creates schema 
DB=sport_db
USER=htron
docker exec "${CONTAINER_ID}" psql -d "${DB}"  --username "${USER}" -f /root/work/index1.sql

# add/run script to container-sport_db
stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/copyteams.sh);
# echo $stdout

stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/copyplayers.sh)

# add/run script to container 
stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/copyraces.sh)

# add/run script to container 

# set positional arguments (overwrites  arguments )
set -- $stdout

pageseff=$(( $2  / 50  ))
pages="$pageseff"

tail=0
total=$2
if ((pages * 50 != $2 )); then 
    pages=$((  ( $2  + 50  - 1  ) / 50  ))
fi

echo "pages $pageseff"
echo "pages $pages"


rule="$pageseff 50"
for ((i=1; i<=$pageseff; i++))
do
    start=$(( ($i-1) * 50 ))
    end=$(( $i * 50 ))
    # echo "$start     $end"
done
if (( pageseff != $pages )); then
    start=$(( ($pages-1) * 50 ))
    end=$(( $pages * 50 ))
    n=$(( $2 - start   ))
    rule="$rule 1 $n"
    tail=$n
fi
stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/pageinfo.sh $pages $tail $total)
echo $stdout

stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/copypts.sh & )
echo $stdout

stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/copyplayed.sh & )
echo $stdout

stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/copyimages.sh & ) # cpy images link  table to  database 
echo $stdout