#!/bin/bash
DB=sport_db
USER=htron
NPLAYERS=25645
NUMGAMES=100

cwd=/root/work/media/images/players

#  /media/images/players

#  create  csv 

echo "player_id, img" > images_list.csv
image=""

for ((i=1; i<=NPLAYERS; i++))
do
    index=""
    if ((  i % 2 == 0  )); then
        
        index=2

    else 

        index=1
    
    fi 

    echo "$i, $cwd/player_${index}.png" >> images_list.csv 

done

echo "done"