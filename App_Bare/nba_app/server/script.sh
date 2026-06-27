
ENDPOINT=""
PORT_MONITOR=50214
PORT_BINNY=50215
URL="http://127.0.0.1:${PORT_MONITOR}/${ENDPOINT}"
AUTH_TOKEN=""

my_async_function() {
    local pid="$1"
    echo -e "process id ${pid} ${URL}\n" 
    sleep 3 
    kill "${pid}" > /dev/null 2>&1 
    echo -e "Function finished!\n"
}

pid_1=""
pid_2=""

echo -e "send request to binny\n"

# GET 
command=" curl  -o temp.txt ${URL} &"

eval $command 
eval_pid=$! # eval command's  process
my_async_function $eval_pid &

sleep 0.5
FILE="temp.txt"
target_count=2
count=0
target_strings=( "nba" "binny")
URL="http://127.0.0.1:${PORT_BINNY}/${ENDPOINT}"

#  Confirm services available by monitor 
for item in "${target_strings[@]}"
do
    grep  "${item}" $FILE > /dev/null 2>&1 
    if [ $? -eq 0 ]; then  
        count=$((count + 1))
    fi
done 

# // change directory to root ( required form app filesystem )
cd ../

#  Turn on NBA Server 
if [[ count=target_count ]]; then
    echo "" > server/temp.text 
    nohup node server/server.ts > server/temp.text 2>&1 &

    sleep 2

    log=$(<server/temp.text) # read entire file 
    regex="(.+(\"pid\":([0-9]+)).+)"
    regex2="(.+(EADDRINUSE:).+)" 
    regex3="(.+\"port\":([0-9]+).+)" 
    port1=""
    # regex operation 
    if [[ $log =~ $regex2 ]]; then 
        echo "nba already running"
    fi
    
    if [[ $log =~ $regex ]]; then 
        pid_1="${BASH_REMATCH[3]}"
    fi 

    if [[ $log =~ $regex3 ]]; then 
        port1="${BASH_REMATCH[2]}"
    fi 

#  Turn on Binny Server 
    echo "" > server/temp2.text 
    nohup node server/server2.ts > server/temp2.text 2>&1 &
    sleep 2

    log2=$(<server/temp2.text) # read entire file 
    regex="(.+(\"pid\":([0-9]+)).+)"
    regex2="(.+(EADDRINUSE:).+)" 
    regex3="(.+\"port\":([0-9]+).+)" 
    port2=""

    # regex operation 
    if [[ $log2 =~ $regex2 ]]; then 
        echo " already running"
    fi

    if [[ $log2 =~ $regex ]]; then 
        pid_2="${BASH_REMATCH[3]}"
    fi 

    if [[ $log2 =~ $regex3 ]]; then 
        port2="${BASH_REMATCH[2]}"
    fi 
    
    echo -e "process ids ${pid_1} ${pid_2}\n"
    echo -e "process ports ${port1} ${port2}\n"
    echo "Use browser to connect to server at http://127.0.0.1:${port1} "

    #  remove tmp files 
    rm server/temp.text
    rm server/temp.txt
    rm server/temp2.text
fi

