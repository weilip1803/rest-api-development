docker stop $(sudo docker ps -a -q)
docker rmi $(sudo docker images -a -q)
docker rm $(sudo docker ps -a -q)
