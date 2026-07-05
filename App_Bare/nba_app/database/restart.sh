container=$(docker ps -a | awk '{print $1}' | tail -n 1 | xargs)

if [[ "${container}" != "" ]]; then 
    # start container
    docker start "${container}";
    # services interactive shell 
    docker exec -it "${container}" psql -U postgres
fi 