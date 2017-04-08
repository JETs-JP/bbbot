// -----------------------------------------------------------------------------
// 定数の設定
const LINE_CHANNEL_ACCESS_TOKEN = 'IRIqea/LVFsN8OH+W3bhDP2soU23XGCUpLfdphiuWcb0JHIBL0xXtBk31gC4Pt1HCMV6g3eYntth2/dqpM7KJk7DeIjjuEDtqPMNeyBxyAxD0/w4xPeREHEmCmi/ALs4/Z2xKeZ0z1mu3prOgN1b7wdB04t89/1O/w1cDnyilFU=';

// -----------------------------------------------------------------------------
// モジュールのインポート
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

// -----------------------------------------------------------------------------
// ミドルウェア設定
app.use(bodyParser.json());

// -----------------------------------------------------------------------------
// Webサーバー設定
var port = (process.env.PORT || 3000);
var server = app.listen(port, function() {
    console.log('Node is running on port ' + port);
});

// -----------------------------------------------------------------------------
// ルーター設定
app.get('/', function(req, res, next){
    res.send('Node is running on port ' + port);
});

app.post('/webhook', function(req, res, next){
    res.status(200).end();
    for (var evt of req.body.events){
        if (evt.type == 'message'){
            console.log(evt.message);
            if (evt.message.text == 'ハロー'){
                var headers = {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
                };
                var body = {
                    replyToken: evt.replyToken,
                    messages: [{
                        type: 'text',
                        text: 'こんにちはー'
                    }]
                };
                var url = 'https://api.line.me/v2/bot/message/reply';
                request({
                    url: url,
                    method: 'POST',
                    headers: headers,
                    body: body,
                    json: true
                });
            }
        }
    }
});

