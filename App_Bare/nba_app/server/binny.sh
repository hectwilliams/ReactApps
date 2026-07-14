
ENDPOINT="binnyon"
ADDRESS=127.0.0.1
PORT_MONITOR=50214
URL="http://${ADDRESS}:${PORT_MONITOR}/power=binny"
AUTH_TOKEN=""

# POST 
command="
curl 
-s 
-X 
POST ${URL}
-H \"Content-Type: application/json\" 
-H \"Authorization: Bearer\"
-d '{
    \"title\": \"Power on binny service\",
    \"body\": \"This request was sent from bash script\",
}'

&
"
eval $command 