#!/bin/bash

# node required 
node="$HOME/.nvm/versions/node/v24.15.0/bin/node"

# cd ..

if [[ "$1" == "nba" ]]; then 

    node "./server/server.ts" > tmp 2> /dev/null &
    eval_pid=$! # eval command's  process
    echo ${eval_pid} // print stdout 

elif [[ "$1" == "binny" ]]; then 
    node ./server/server2.ts > tmp 2> /dev/null &
    eval_pid=$! # eval command's  process
    echo ${eval_pid} // print stdout 
else

    echo "h"

fi 

