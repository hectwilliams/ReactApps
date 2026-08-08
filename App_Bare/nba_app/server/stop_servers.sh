#!/bin/bash

# node required 
node="$HOME/.nvm/versions/node/v24.15.0/bin/node"

serverName=$1 
processID=$2

if [[ "$1" == "nba" ]]; then 
    echo "${processID}.  ${serverName}"
    msg=$(kill  "${processID}")
    # echo $msg
    # node ./server/server.ts > tmp 2> tmpe &
elif [[ "$1" == "binny" ]]; then 
    msg=$(kill  "${processID}")
    echo $msg
else 
    echo ""
fi 

