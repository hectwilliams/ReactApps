#!/bin/bash
DB=sport_db
USER=htron
NPLAYERS=25645
NUMGAMES=100

# create  csv 

echo "player_id, played" > plot_played.csv


for ((i=1; i<=NPLAYERS; i++))
do
    # date=[

    list=[
    
    for ((k=1; k<=NUMGAMES; k++))
    do
        r=$(echo $(( (RANDOM % 10) + 1 )))
        list="$list$r"
        # date="$date'2026-07-07'"
        if (( k < NUMGAMES )); then 
            list="$list;"
            # date="$date;"
        else 
            list="$list]"
            # date="$date]"
        fi 
    done

    echo "$i, $list" >> plot_played.csv 
done

echo "done"