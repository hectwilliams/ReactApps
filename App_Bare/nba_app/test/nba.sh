
#!/bin/bash 

# Run script from server directory 

ENDPOINT="nbaon"
ADDRESS=127.0.0.1
PORT_MONITOR=50214
URL="http://${ADDRESS}:${PORT_MONITOR}/power=nba"
# http://127.0.0.1:50215/page=0
AUTH_TOKEN=""

echo ${PWD}

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
-o test2.txt
&
"
eval $command 