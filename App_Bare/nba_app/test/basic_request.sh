#!/bin/bash 

ENDPOINT="binny"
URL="http://127.0.0.1:50216/${ENDPOINT}"
AUTH_TOKEN=""

my_async_function() {
    local pid="$1"
    echo "Function started..."
    echo "process id ${pid}"
    sleep 5
    kill "${pid}"
    # echo -e "Function finished!\n"
}


echo " send request to binny"

# POST 
command="
curl 
-s 
-X 
POST ${URL}
-H \"Content-Type: application/json\" 
-H \"Authorization: Bearer\"
-d '{
    \"title\": \"Binny test\",
    \"body\": \"This request was sent from bash script\",
    \"userId\": 0,
    \"amplitude\": 1
}'

&
"

eval $command 
eval_pid=$! # eval command's  process
my_async_function $eval_pid &