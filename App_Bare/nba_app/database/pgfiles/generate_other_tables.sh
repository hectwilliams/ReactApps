# Generates new csv files matched to table fields for nba.players and nba.race tables
# The original raw player's is required for this script (i.e. nbagold.csv).

regex="(.+,([A-Z]{3}),([A-Z]),.+)"
regex2="(([0-9]+),[A-Z]{3})"

teamslist=$(<"$PWD/../nbateams.csv")

count=0
pad=""

# capture time 
# Reset the counter to 0
SECONDS=0

while IFS=, read -r line; 
do

    if (( count == 0 )); then 
        echo  "id, player, tm , unnamed, opp, result, mp ,fg ,fga, fpp,trep,trepa,trepp,ft,fta, ftp, orb, drb, trb, ast, stl, blk, tov, pf, pts, plusminus, gmsc, date" > nba2.csv
        echo "id,race,playerid" > race.csv

    elif [[ "$line" =~ $regex ]]; then 
        
        target=${BASH_REMATCH[2]}
        tm=$(echo "$teamslist" | grep $target)

         if [[ "$tm" =~ $regex2 ]]; then 
            
            playerid="${BASH_REMATCH[2]}"
            # prepend serial id to nba players
            echo "${count},${line}" >> nba2.csv
            # set race per line each player
            echo "${count},asian,${playerid}"'' >> race.csv

         fi

    else

        echo ""
    fi

    count=$((count + 1))

done < nbagold.csv

echo "$(date) , seconds: $SECONDS" >> log.txt 
