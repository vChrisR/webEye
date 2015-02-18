var debug = require('debug')('webEye');
var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
	var resBody = { result: "Service not available" };
	res.statusCode = 503;

	if (req.query.apikey != process.env.VOKEY) {
		debug("Invalid API key received")
 		resBody = { result: "Invalid API key. Your are not authorized to exectute this action" }
 		res.statusCode = 403;
	} else {

  		var amqpExchange = req.app.get('amqpExchange');
  		var messageToRelay = req.body;
  		var validMessage =  Boolean(messageToRelay.criticality) && Boolean(messageToRelay.resourceId) && Boolean(messageToRelay.adapterKind);

  		if (! validMessage) {
  			resBody = { result: "Invalid message" };
  			res.statusCode = 400;
  		}

		debug("message received on /vrops resource:");
  		debug(messageToRelay);
  		debug("Valid vROPS Message? " +validMessage);

  		if (amqpExchange && validMessage) {
	  		debug("Relaying message using AMQP...");
  			amqpExchange.publish("webeye.vrealize.operations", messageToRelay, {contentType: 'application/json'}, {}, function(e) { console.log("message posted")});
  			resBody = { result: "success" };
  			res.statusCode = 200;
  		}
  	}

  	res.json(resBody);
  
});

module.exports = router;