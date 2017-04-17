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

    static date(replyToken, botMemory) {
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
                                data: "{ \"date\": \"today\" }"
                            },
                            {
                                type: 'postback',
                                label: '明日',
                                text: '明日',
                                data: "{ \"date\": \"tomorrow\" }"
                            },
                            {
                                type: 'postback',
                                label: 'あさって',
                                text: 'あさって',
                                data: "{ \"date\": \"after_tomorrow\" }"
                            },
                            {
                                type: 'postback',
                                label: 'それ以外',
                                text: 'それ以外',
                                data: "{ \"date\": \"none_of_them\" }"
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

    static time(replyToken, botMemory) {
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
                {
                    type: 'text',
                    text: botMemory.date + 'の何時がいいですか？'
                },
                {
                    type: 'template',
                    altText: 'スマートフォンでないと話せないんだよね…。',
                    template: {
                        type: 'carousel',
                        text: '何時？',
                        columns: [
                            {
                                text: '朝',
                                actions: [
                                    {
                                        type: 'postback',
                                        text: '9時',
                                        label: '9時',
                                        data: "{ \"time\": 9 }"
                                    },
                                    {
                                        type: 'postback',
                                        text: '10時',
                                        label: '10時',
                                        data: "{ \"time\": 10 }"
                                    },
                                    {
                                        type: 'postback',
                                        text: '11時',
                                        label: '11時',
                                        data: "{ \"time\": 11 }"
                                    }
                                ]
                            },
                            {
                                text: '昼',
                                actions: [
                                    {
                                        type: 'postback',
                                        text: '13時',
                                        label: '13時',
                                        data: "{ \"time\": 13 }"
                                    },
                                    {
                                        type: 'postback',
                                        text: '14時',
                                        label: '14時',
                                        data: "{ \"time\": 14 }"
                                    },
                                    {
                                        type: 'postback',
                                        text: '15時',
                                        label: '15時',
                                        data: "{ \"time\": 15 }"
                                    }
                                ]
                            },
                            {
                                text: '夜',
                                actions: [
                                    {
                                        type: 'postback',
                                        text: '16時',
                                        label: '16時',
                                        data: "{ \"time\": 16 }"
                                    },
                                    {
                                        type: 'postback',
                                        text: '17時',
                                        label: '17時',
                                        data: "{ \"time\": 17 }"
                                    },
                                    {
                                        type: 'postback',
                                        text: 'それ以外',
                                        label: 'それ以外',
                                        data: "{ \"time\": \"none_of_them\" }"
                                    }
                                ]
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

}
