const LINE_CHANNEL_ACCESS_TOKEN = '{your token}';

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

    static greet(replyToken, botMemory) {
        var headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
        };
        var body = {
            replyToken: replyToken,
            messages: [
                {
                    type: 'text',
                    text: 'こんにちは！会議室を取るよ！'
                },
                {
                    type: 'template',
                    altText: 'スマートフォンでないと話せないんだよね…。',
                    template: {
                        type: 'buttons',
                        text: 'いつ？',
                        actions: [
                            {
                                type: 'postback',
                                label: '今日',
                                text: '今日',
                                data: 'today'
                            },
                            {
                                type: 'postback',
                                label: '明日',
                                text: '明日',
                                data: 'tomorrow'
                            },
                            {
                                type: 'postback',
                                label: 'あさって',
                                text: 'あさって',
                                data: 'after_tomorrow'
                            },
                            {
                                type: 'postback',
                                label: 'それ以外',
                                text: 'それ以外',
                                data: 'none_of_them'
                            }
                        ]
                    }
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

    static confirm_date(replyToken, botMemory) {
        var headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
        };
        var body = {
            replyToken: replyToken,
            messages: [
                {
                    type: 'text',
                    text: botMemory.date + 'ですね！'
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
