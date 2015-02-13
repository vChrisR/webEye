webEye
======
# Overview
This is the eye for the docker web hooks to hook into. Received webhooks are relayed to an AMQP message bus. It's up to you to process the webhook from there.

The dockerhub callback is called right after posting the json payload on the message bus. It does not wait until you actually processed the message. This may change in the future.

# Version info
Warning: this is just a protoype. code is untested and probably insecure for now. Use at your own risk.

#Run
This app was designed to run in a docker container. So make sure you have docker installed and then follow instructions below:
- Let's start an AMQP Server: docker run --name rabbit -p 5672:5672 -p 15672:15672 dockerfile/rabbitmq
- start webEye: docker run -p 80:80 -p 443:443 -e "DHKEY=12345" -e "MBKEY=12345" --name webEye --link rabbitmq:rabbit -t vchrisr/webeye
- The DHKEY in the line above sets the API key that you need to send with the request. This adds a bit of security. Make sure to put in a random string instead of "12345"
- Now make sure port 80 on your webEye server is mapped to a public ip address
- Create a docker webhook to http://{your public ip}:<{public port}/dockerhub?apikey=12345
- Connect your consumer to the rabbitMQ server
- Create a new Q to receive your messages
- Create a binding routing messages with routing key webeye.docker.hub to your Q
- Start using the received webhook messages :)

I recently added some functionality which is called "magic Button". The point is to create an endpoint at which you can just shoot a message from where ever and trigger a vRO workflow which does some magic. To use it POST a JSON to http://{your public ip}:<{public port}/magicbutton?apikey=12345. The body should look like this:

{ "event": "something happened"}

The routing key for the magic button Q is: webeye.magic.button

Now the AMQP consumer can read the event and act accordingly.
