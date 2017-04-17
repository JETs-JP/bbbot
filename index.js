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
        var botMemory = memory.get(evt.source.userId);
        if (!botMemory) {
            botMemory = {};
            memory.put(evt.source.userId, botMemory);
        }
        if (evt.type == 'message') {
            console.log(evt.message);
            if (!botMemory.date) {
                // 今は必ず日付を最初に質問する前提で、それに依存した実装になっている
                if (evt.message.text == 'ハロー') {
                    bbbot.date(evt.replyToken);
                } else {
                    bbbot.dumb(evt.replyToken);
                }
            } else if (!botMemory.time) {
                // 会話の流れをチェックする
                bbbot.time(evt.replyToken, botMemory);
            }
        }
        if (evt.type == 'postback') {
            console.log('postback data: ' + evt.postback.data);
            var data = JSON.parse(evt.postback.data);
            for (var key in data) {
                botMemory[key] = data[key];
            }
            memory.put(evt.source.userId, botMemory);
        }
        console.log(botMemory);
    }
});
