var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var memory = require('memory-cache');
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
        if (!evt.type == 'message') {
            continue;
        }
        var botMemory = memory.get(evt.source.userId);
        if (!botMemory) {
            botMemory = {
                status: null
            }
            memory.put(evt.source.userId, botMemory);
        }
        console.log(evt.message);
        switch(botMemory.status) {
            case 'begin':
                if (evt.message.text == 'はい') {
                    bbbot.ask(evt.replyToken);
                    botMemory.status = 'begin';
                    memory.put(evt.source.userId, botMemory);
                }
                break;
            default:
                if (evt.message.text == 'ハロー') {
                    bbbot.greet(evt.replyToken);
                    botMemory.status = 'begin';
                    memory.put(evt.source.userId, botMemory);
                } else {
                    bbbot.dumb(evt.replyToken);
                }
        }
        console.log(botMemory);
    }
});
