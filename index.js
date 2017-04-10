var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var bbbot = require('./bbbot');
var app = express();

app.use(bodyParser.json());

var port = (process.env.PORT || 3000);
var server = app.listen(port, function() {
    console.log('Node is running on port ' + port);
});

//--------

app.get('/', function(req, res, next) {
    res.send('Node is running on port ' + port);
});

app.post('/webhook', function(req, res, next) {
    res.status(200).end();
    for (var evt of req.body.events) {
        if (evt.type == 'message') {
            console.log(evt.message);
            if (evt.message.text == 'ハロー') {
                bbbot.ask(evt.replyToken);
            }
        }
    }
});
