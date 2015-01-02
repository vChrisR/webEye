var debug = require('debug')('webEye');
var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  var amqpExchange = req.app.get('amqpExchange');
  var messageToRelay = req.body;
  debug("message received on /dockerhub resource: ");
  debug(messageToRelay);
  if (amqpExchange) {
	  debug("Relaying message using AMQP...");
	  setImmediate(function () {
		amqpExchange.publish("webeye.docker.hub", messageToRelay, {contentType: 'application/json'}, {}, function() { console.log("message delivered") })
	  } );
  }
  res.json({ "status": "OK" }); 
});

module.exports = router;
