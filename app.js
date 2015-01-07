var debug = require('debug')('webEye');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var amqp = require('amqp');

var routes = require('./routes/index');
var dockerhub = require('./routes/dockerhub.js');

var app = express();

var ampqExchange;

var amqpHost = process.env.RABBIT_PORT_5672_TCP_ADDR || 'localhost';
var amqpPort = process.env.RABBIT_PORT_5672_PORT || 5672;

debug("Using AMQP host:" +amqpHost +":" + amqpPort);

var amqpConnection = amqp.createConnection({ host: amqpHost, port: amqpPort, login: 'guest', password: 'guest' });
amqpConnection.on('ready', function () {
	amqpExchange = amqpConnection.exchange('webEye', { type: "topic", confirm: true, durable: true } );
	app.set('amqpExchange', amqpExchange);
	debug('AMQP Connected');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
	
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/dockerhub', dockerhub);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
