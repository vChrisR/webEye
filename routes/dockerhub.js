var debug = require('debug')('webEye');
var rest = require('restler');
var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
	var resBody = { result: "service not available" };
	res.statusCode = 503;

	if (req.query.apikey != process.env.DHKEY) {
		debug("Invalid API key received")
 		resBody = { result: "Invalid API key. Your are not authorized to exectute this action" }
 		res.statusCode = 403;
	} else {

		var amqpExchange = req.app.get('amqpExchange');
		var messageToRelay = req.body;
		var validMessage =  Boolean(messageToRelay.callback_url && messageToRelay.push_data && messageToRelay.repository);

  		if (! validMessage) {
			resBody = { result: "invalid message" };
			res.statusCode = 400;
  		}

  		debug("message received on /dockerhub resource:");
  		debug(messageToRelay);
  		debug("Valid docker hub message? " +validMessage);

  		if (amqpExchange && validMessage) {
			debug("Relaying message using AMQP...");
        	amqpExchange.publish("webeye.docker.hub", messageToRelay, {contentType: 'application/json'}, {}, function(e) { console.log("message posted")});
	  		resBody = { result: "success" };
	  		res.statusCode = 200;
  		}
  	}

 	res.json(resBody);
  
  	if (res.statusCode == 200) {
  		setImmediate(doCallback, messageToRelay.callback_url, 60);
  	}
});

function doCallback(callbackUrl, retryCount) { 
	var callbackPayload = {
		"state": "success",
  		"description": "Webhook relayed to AMQP bus.",
		"context": "webEye",
		"target_url": ""
	}
	retryCount--;
	rest.postJson(callbackUrl, callbackPayload)
		.on('error', function(err, response) {
			if (retryCount > 0) {	
				debug("Callback to " +callbackUrl +" failed. Retrying. Retry countdown: "+retryCount);
				setTimeout(doCallback, 120000, callbackUrl, retryCount);
			} else {
				console.log("Callback to " +callbackUrl +" failed. Retry count reached. callback cancelled");
			}
		});
}

module.exports = router;