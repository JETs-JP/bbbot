const LINE_CHANNEL_ACCESS_TOKEN = '{your token}';

var request = require('request');

/*
 * button template message definition
 */
var ButtonsMessage = function(text) {
    this.text = text;
    this.actions = [];
};

ButtonsMessage.prototype.addAction = function(text, data) {
    this.actions.push({
        text,
        data
    });
};

ButtonsMessage.prototype.build = function() {
    var message = {
        type: 'template',
        altText: 'スマホじゃないと話せないんだよね…。',
        template: {
            type: 'buttons',
            text: this.text,
            actions: []
        }
    };
    // TODO: this.actionsがなければエラー
    for (var a of this.actions) {
        var action = {
            type: 'postback',
            label: a.text,
            text: a.text,
            data: a.data
        }
        message.template.actions.push(action);
    }
    return message;
};

/*
 * main skeleton impl of LINE REPLY_MESSAGE API
 */
var Reply = function(replyToken) {
    this.replyToken = replyToken;
    this.messages = [];
};

Reply.prototype.url = 'https://api.line.me/v2/bot/message/reply';

Reply.prototype.method = 'POST';

Reply.prototype.headers = {
    'Content-type': 'application/json',
    'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
};

Reply.prototype.addMessage = function(message) {
    this.messages.push(message);
}

Reply.prototype.addTextMessage = function(text) {
    var message = {
        type: 'text',
        text: text
    };
    this.addMessage(message);
}

Reply.prototype.addButtonsMessage = function(buttons) {
    this.addMessage(buttons.build());
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

/*
 * bbbot module's main body.
 */
module.exports = class bbbot {
    static date(replyToken) {
        var ask = new Reply(replyToken);
        ask.addTextMessage('こんにちは！会議室を取るよ！');
        var buttons = new ButtonsMessage('いつ？');
        buttons.addAction('今日', "{ \"date\": \"today\" }");
        buttons.addAction('明日', "{ \"date\": \"tomorrow\" }");
        buttons.addAction('あさって', "{ \"date\": \"after_tomorrow\" }");
        buttons.addAction('それ以外', "{ \"date\": \"none_of_them\" }");
        ask.addButtonsMessage(buttons);
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
        ask.addTextMessage(date + 'だね！');
        ask.addTextMessage('なんじから？');
        ask.addMessage({
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
        });
        ask.execute();
    }

    static turnout(replyToken, botMemory) {
        var ask = new Reply(replyToken);
        ask.addTextMessage(botMemory.time + '時だね！');
        ask.addTextMessage('なんにん？');
        ask.execute();
    }

    static duration(replyToken, botMemory) {
        var ask = new Reply(replyToken);
        ask.addTextMessage(botMemory.turnout + '人だね！');
        var buttons = new ButtonsMessage('なんぷん？');
        buttons.addAction('30分', "{ \"duration\": 30 }");
        buttons.addAction('60分', "{ \"duration\": 60 }");
        buttons.addAction('それ以外', "{ \"duration\": \"none_of_them\" }");
        ask.addButtonsMessage(buttons);
        ask.execute();
    }

    static room(replyToken, botMemory) {
        var ask = new Reply(replyToken);
        ask.addTextMessage(botMemory.duration + '分だね！');
        var buttons = new ButtonsMessage('開いている部屋はこれだよ。どれがいい？');
        buttons.addAction('15M1', "{ \"room\": \"15M1\" }");
        buttons.addAction('17M2', "{ \"room\": \"17M2\" }");
        buttons.addAction('19M3', "{ \"room\": \"19M3\" }");
        buttons.addAction('20M6', "{ \"room\": \"20M6\" }");
        ask.addButtonsMessage(buttons);
        ask.execute();
    }

    static title(replyToken, botMemory) {
        var ask = new Reply(replyToken);
        ask.addTextMessage('OK! 予約しちゃうよ。');
        ask.addTextMessage('なんて名前で予約する？');
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
        ask.addTextMessage('OK! 予約できたよ！');
        ask.addTextMessage('名前: ' + botMemory.title + '\n' + '日時: ' + dateString + ' ' + begin + '～' + end + '\n' + '場所: ' + botMemory.room);
        ask.execute();
    }

    static abandon(replyToken) {
        var ask = new Reply(replyToken);
        ask.addTextMessage('ちょっと僕にはむずかしいな・・・');
        ask.addTextMessage('近くのアドミさんに相談してみてね！');
        ask.execute();
    }
}
