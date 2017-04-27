var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var memory = require('memory-cache');
var bbbot = require('./bbbot');
var app = express();

app.use(bodyParser.json());
app.use(express.static('static'));

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
        }
        if (evt.type == 'message') {
            console.log(evt.message);
            if (evt.message.text == 'それ以外') {
                bbbot.abandon(evt.replyToken);
                memory.put(evt.source.userId, {});
                continue;
            }
            if (!botMemory.date) {
                // 今は必ず日付を最初に質問する前提で、それに依存した実装になっている
                bbbot.date(evt.replyToken);
            } else if (!botMemory.time) {
                // 会話の流れをチェックする
                bbbot.time(evt.replyToken, botMemory);
            } else if (!botMemory.turnout) {
                bbbot.turnout(evt.replyToken, botMemory);
                botMemory.turnout = 'waiting_reply';
            } else if (botMemory.turnout == 'waiting_reply') {
                botMemory.turnout = parseInt(evt.message.text, 10);
                bbbot.duration(evt.replyToken, botMemory);
            } else if (!botMemory.room) {
                bbbot.room(evt.replyToken, botMemory);
            } else if (!botMemory.title) {
                bbbot.title(evt.replyToken, botMemory);
                botMemory.title = 'waiting_reply';
            } else if (botMemory.title == 'waiting_reply') {
                botMemory.title = evt.message.text;
                bbbot.result(evt.replyToken, botMemory);
                botMemory = {};
            }
        }
        if (evt.type == 'postback') {
            console.log('postback data: ' + evt.postback.data);
            var data = JSON.parse(evt.postback.data);
            for (var key in data) {
                botMemory[key] = data[key];
            }
        }
        memory.put(evt.source.userId, botMemory);
        console.log(botMemory);
    }
});
