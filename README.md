# PortfolioServer
Node Server Code used for my portfolio site, which is customized from the Node-Skeleton repo

## Setup
+ ```adduser <username>```
  + to create a new user and make a /home directory
+ ```usermod -aG sudo <username>```
  + to add user to sudoers
+ ```su <username>```
  + to login as that user
+ ```mkdir ~/.ssh```
  + to create our ssh directory
+ ```nano ~/.ssh/authorized_keys```
  + and paste the .pub ssh key
+ ```nano ~/.ssh/github```
  + paste github private key for easy use
+ ```echo "IdentityFile ~/.ssh/github" >> ~/.ssh/config```
  + save the github key permanently
+ ```sudo chmod 600 ~/.ssh/github```
  + set correct file permissions
+ ```sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config```
  + to set root login to off
+ ```sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config```
  + to set logging in with a password off
+ ```sudo service ssh restart```
  + to update ssh
+ ```sudo ufw allow <port>```
  + for each service we want
+ ```sudo ufw enable```
  + to start the firewall
