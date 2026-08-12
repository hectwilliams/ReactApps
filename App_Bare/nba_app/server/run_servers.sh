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
    echo ""
fi 




# sql

# WITH stats AS (
#     SELECT 
#         MIN(score) AS min_val, 
#         MAX(score) + 0.01 AS max_val -- slight offset prevents max value overflow
#     FROM results_table
# ),
# bucketed_data AS (
#     SELECT 
#         score,
#         WIDTH_BUCKET(score, stats.min_val, stats.max_val, 5) AS bucket_id
#     FROM results_table, stats
# )
# SELECT 
#     bucket_id,
#     COUNT(*) AS record_count,
#     MIN(score) AS lowest_in_bucket,
#     MAX(score) AS highest_in_bucket
# FROM bucketed_data
# GROUP BY bucket_id
# ORDER BY bucket_id;
