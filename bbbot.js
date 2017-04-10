const LINE_CHANNEL_ACCESS_TOKEN = '{your token}';

var request = require('request');

//--------

module.exports = class bbbot {
    static ask(replyToken) {
        var headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
        };
        var body = {
            replyToken: replyToken,
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
