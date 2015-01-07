webEye
======
# Overview
This is the eye for the docker web hooks to hook into. Received webhooks are relayed to an AMQP message bus. It's up to you to process the webhook from there.

The dockerhub callback is called right after posting the json payload on the message bus. It does not wait until you actually processed the message. This may change in the future.

# Version info
Warning: this is just a protoype. code is untested and probably insecure for now. Use at your own risk.

