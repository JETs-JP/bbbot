const LINE_CHANNEL_ACCESS_TOKEN = '{yout token}';

var request = require('request');

//--------

module.exports = class bbbot {
    static dumb(replyToken) {
        var headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
        };
        var body = {
            replyToken: replyToken,
            messages: [
                {
                    type: 'text',
                    text: '...'
                }
            ]
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

    static greet(replyToken) {
        var headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
        };
        var body = {
            replyToken: replyToken,
            messages: [
                {
                    type: 'text',
                    text: 'こんにちはー'
                },
                {
                    type: 'text',
                    text: '会議室をお探しですか？'
                }
            ]
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

    static ask(replyToken) {
        var headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
        };
        var body = {
            replyToken: replyToken,
            messages: [
                {
                    type: 'text',
                    text: 'それじゃあ、いつでお探しか教えてください！'
                },
            ]
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
