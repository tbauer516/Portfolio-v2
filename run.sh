docker run -d -v ~/.ssh:/home/node/.ssh -v $(pwd):/usr/srv/app -w /usr/srv/app --name portfolio -p 8202:8080 node-chrome 
