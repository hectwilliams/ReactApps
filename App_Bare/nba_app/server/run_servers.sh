#!/bin/bash

# node required 
node="$HOME/.nvm/versions/node/v24.15.0/bin/node"

# cd ..
serverName=$1 
pathf="$PWD/server/server.ts"

if [[ "$1" == "nba" ]]; then 

    node "./server/server.ts" > tmp 2> /dev/null &
    eval_pid=$! # eval command's  process
    echo ${eval_pid} // print stdout 
else
    node ./server/server2.ts > tmp 2> /dev/null &
    eval_pid=$! # eval command's  process
    echo ${eval_pid} // print stdout 
fi 

