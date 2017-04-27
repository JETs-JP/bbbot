const LINE_CHANNEL_ACCESS_TOKEN = '{your token}';

var request = require('request');

//--------

var Reply = function(replyToken) {
    this.replyToken = replyToken;
};

Reply.prototype.url = 'https://api.line.me/v2/bot/message/reply';

Reply.prototype.method = 'POST';

Reply.prototype.headers = {
    'Content-type': 'application/json',
    'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
};

Reply.prototype.setMessages = function(messages) {
    this.messages = messages;
}

Reply.prototype.execute = function() {
    // TODO: エラーハンドリング
    request({
        url: this.url,
        method: this.method,
        headers: this.headers,
        body: {
            replyToken: this.replyToken,
            messages: this.messages
        },
        json: true
    });
};

module.exports = class bbbot {
    static date(replyToken) {
        var ask = new Reply(replyToken);
        ask.setMessages([
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
        ]);
        ask.execute();
    }

    static time(replyToken, botMemory) {
        var date;
        if (botMemory.date == 'today') {
            date = '今日';
        } else if (botMemory.date == 'tomorrow') {
            date = 'あした';
        } else if (botMemory.date == 'after_tomorrow') {
            date = 'あさって';
        }
        var ask = new Reply(replyToken);
        ask.setMessages([
            {
                type: 'text',
                text: date + 'だね！'
            },
            {
                type: 'text',
                text: 'なんじから？'
            },
            {
                type: 'template',
                altText: 'スマートフォンでないと話せないんだよね…。',
                template: {
                    type: 'carousel',
                    text: '何時？',
                    columns: [
                        {
                            thumbnailImageUrl: 'https://bbbot-a63225.apaas.us6.oraclecloud.com/images/morning.jpg',
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
                            thumbnailImageUrl: 'https://bbbot-a63225.apaas.us6.oraclecloud.com/images/daytime.jpg',
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
                            thumbnailImageUrl: 'https://bbbot-a63225.apaas.us6.oraclecloud.com/images/evening.jpg',
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
        ]);
        ask.execute();
    }

    static turnout(replyToken, botMemory) {
        var ask = new Reply(replyToken);
        ask.setMessages([
            {
                type: 'text',
                text: botMemory.time + '時だね！'
            },
            {
                type: 'text',
                text: 'なんにん？'
            }
        ]);
        ask.execute();
    }

    static duration(replyToken, botMemory) {
        var ask = new Reply(replyToken);
        ask.setMessages([
            {
                type: 'text',
                text: botMemory.turnout + '人だね！'
            },
            {
                type: 'template',
                altText: 'スマートフォンでないと話せないんだよね…。',
                template: {
                    type: 'buttons',
                    text: 'なんぷん？',
                    actions: [
                        {
                            type: 'postback',
                            label: '30分',
                            text: '30分',
                            data: "{ \"duration\": 30 }"
                        },
                        {
                            type: 'postback',
                            label: '60分',
                            text: '60分',
                            data: "{ \"duration\": 60 }"
                        },
                        {
                            type: 'postback',
                            label: 'それ以外',
                            text: 'それ以外',
                            data: "{ \"duration\": \"none_of_them\" }"
                        }
                    ]
                }
            }
        ]);
        ask.execute();
    }

    static room(replyToken, botMemory) {
        var ask = new Reply(replyToken);
        ask.setMessages([
            {
                type: 'text',
                text: botMemory.duration + '分だね！'
            },
            {
                type: 'template',
                altText: 'スマートフォンでないと話せないんだよね…。',
                template: {
                    type: 'buttons',
                    text: '開いている部屋はこれだよ。どれがいい？',
                    actions: [
                        {
                            type: 'postback',
                            label: '15M1',
                            text: '15M1',
                            data: "{ \"room\": \"15M1\" }"
                        },
                        {
                            type: 'postback',
                            label: '17M2',
                            text: '17M2',
                            data: "{ \"room\": \"17M2\" }"
                        },
                        {
                            type: 'postback',
                            label: '19M3',
                            text: '19M3',
                            data: "{ \"room\": \"19M3\" }"
                        },
                        {
                            type: 'postback',
                            label: '20M6',
                            text: '20M6',
                            data: "{ \"room\": \"20M6\" }"
                        }
                    ]
                }
            }
        ]);
        ask.execute();
    }

    static title(replyToken, botMemory) {
        var ask = new Reply(replyToken);
        ask.setMessages([
            {
                type: 'text',
                text: 'OK! 予約しちゃうよ。'
            },
            {
                type: 'text',
                text: 'なんて名前で予約する？'
            }
        ]);
        ask.execute();
    }

    static result(replyToken, botMemory) {
        var date;
        if (botMemory.date == 'today') {
            date = new Date();
        } else if (botMemory.date == 'tomorrow') {
            date = new Date((new Date().getTime()) + (60 * 60 * 24 * 1000));
        } else if (botMemory.date == 'after_tomorrow') {
            date = new Date((new Date().getTime()) + (60 * 60 * 24 * 1000 * 2));
        }
        var dateString = (date.getMonth() + 1) + '/' + date.getDate();

        var begin = botMemory.time + ':00';
        var end;
        if (botMemory.duration == 30) {
            end = botMemory.time + ':30';
        } else if (botMemory.duration == 60) {
            end = botMemory.time + 1 + ':00';
        }
        var ask = new Reply(replyToken);
        ask.setMessages([
            {
                type: 'text',
                text: 'OK! 予約できたよ！'
            },
            {
                type: 'text',
                text: '名前: ' + botMemory.title + '\n' + '日時: ' + dateString + ' ' + begin + '～' + end + '\n' + '場所: ' + botMemory.room
            }
        ]);
        ask.execute();
    }

    static abandon(replyToken) {
        var ask = new Reply(replyToken);
        ask.setMessages([
            {
                type: 'text',
                text: 'ちょっと僕にはむずかしいな・・・'
            },
            {
                type: 'text',
                text: '近くのアドミさんに相談してみてね！'
            }
        ]);
        ask.execute();
    }
}
