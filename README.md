webEye
======
# Overview
This is the eye for the docker web hooks to hook into. Received webhooks are relayed to an AMQP message bus. It's up to you to process the webhook from there.

The dockerhub callback is called right after posting the json payload on the message bus. It does not wait until you actually processed the message. This may change in the future.

# Version info
Warning: this is just a protoype. code is untested and probably insecure for now. Use at your own risk.

#Run
THis app was designed to run in a docker container. So make sure you have docker installed and then follow instructions below:
- Let's start an AMQP Server: sudo docker run --name rabbitDock -p 5672:5672 -p 15672:15672 dockerfile/rabbitmq
- start webEye: sudo docker run --name webEye --link rabbitDock:rabbit -p 80:80 vchrisr/webEye
- Now make sure port 80 on your webEye server is mapped to a public ip address
- Create a docker webhook to http://<your public ip>:<public port>/dockerhub
- Connect your consumer to the rabbitMQ server
- Create a new Q to receive your messages
- Create a binding routing messages with routing key webeye.docker.hub to your Q
- Start using the received webhook messages :)