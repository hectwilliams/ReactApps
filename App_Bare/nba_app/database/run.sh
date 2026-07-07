#!/bin/bash

CONTAINER_ID=4d413de49115  # postgres container required 
NAME=nba-pg
#check docker exist  
ret_length=$(docker ps | awk '{print $2}' | sed '1d' | grep "postgres" | wc -m | xargs ) # pipe to xargs removes white space 
echo "$ret_length"

# if [[ $1 == "new" ]]; then
#     ret_length=""
# fi 

if (( ret_length > 0 )); then 
    echo "";
else 
    # start container instance ( installs postgress to shell )

    # name - name of container 
    # e - environmental variable 
    # d - detach mode (sql is a background process)
    # p - map container port to localhost port
    docker run  -p 5432:5432 --name "${NAME}"  -e POSTGRES_PASSWORD=password -e DB_USER=htron -e DB_HOST=localhost  -e DB_NAME=sport_db -e DB_PASSWORD=abcd -d postgres
fi

# mkdir in postgres container (shell)


# -p (make parents if needed)
docker exec  "${CONTAINER_ID}" mkdir -p /root/work

# copy .sql script into container 
docker cp ./pgfiles/index0.sql "${CONTAINER_ID}":/root/work/index0.sql
docker cp ./pgfiles/index1.sql "${CONTAINER_ID}":/root/work/index1.sql
docker cp ./pgfiles/createdb.sh "${CONTAINER_ID}":/root/work/createdb.sh
docker cp ./pgfiles/copyteams.sh "${CONTAINER_ID}":/root/work/copyteams.sh
docker cp ./pgfiles/copyplayers.sh "${CONTAINER_ID}":/root/work/copyplayers.sh
docker cp ./pgfiles/copyraces.sh "${CONTAINER_ID}":/root/work/copyraces.sh
docker cp ./pgfiles/addenv.sh "${CONTAINER_ID}":/root/work/addenv.sh
docker cp ./pgfiles/partition.sh "${CONTAINER_ID}":/root/work/partition.sh
docker cp ./pgfiles/pageinfo.sh "${CONTAINER_ID}":/root/work/pageinfo.sh

# copy csv files 
docker cp ./pgfiles/nbateams.csv "${CONTAINER_ID}":/root/work/nbateams.csv
docker cp ./pgfiles/nba.csv "${CONTAINER_ID}":/root/work/nba.csv
docker cp ./pgfiles/race.csv "${CONTAINER_ID}":/root/work/race.csv

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

# # add/run script to container-sport_db
stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/copyteams.sh);
# echo $stdout

# # add/run script to container 
stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/copyplayers.sh)
echo $stdout

# # add/run script to container 
stdout=$(docker exec "${CONTAINER_ID}"  ./root/work/copyraces.sh)
$stdout

# set positional arguments (overwrites  arguments )
set -- $stdout
pageseff=$(( $2  / 50  ))
pages=pageseff
tail=0
total=$2
if ((pages * 50 != $2 )); then 
    pages=$((  ( $2  + 50  - 1  ) / 50  ))
fi

# echo "pages $pageseff"
# echo "pages $pages"

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