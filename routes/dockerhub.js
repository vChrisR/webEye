var debug = require('debug')('webEye');
var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  var resBody = { result: "service not available" };
  res.statusCode = 503;

  var amqpExchange = req.app.get('amqpExchange');
  var messageToRelay = req.body;

//TODO: Check if message originates from docker hubhub to make sure nobody is messing with us

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
	  setImmediate(function () {
		amqpExchange.publish("webeye.docker.hub", messageToRelay, {contentType: 'application/json'}, {})
	  } );
	  resBody = { result: "success" };
	  res.statusCode = 200;
  }

  res.json(resBody); 
});

module.exports = router;
