const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

var request = require('request');

/*
 * buttons template message definition
 */
var Buttons = function(text) {
    this.text = text;
    this.thumbnailImageUrl = null;
    this.actions = [];
};

Buttons.prototype.addThumbnailImageUrl = function(url) {
    this.thumbnailImageUrl = url;
};

Buttons.prototype.addAction = function(text, data) {
    this.actions.push({
        text,
        data
    });
};

Buttons.prototype.build = function() {
    var obj = [];
    for (var a of this.actions) {
        var action = {
            type: 'postback',
            label: a.text,
            text: a.text,
            data: a.data
        }
        obj.push(action);
    }
    return obj;
};

var ButtonsMessage = function(buttons) {
    this.buttons = buttons;
};

ButtonsMessage.prototype.build = function() {
    var message = {
        type: 'template',
        altText: 'スマホじゃないと話せないんだよね…。',
        template: {
            type: 'buttons',
            thumbnailImageUrl: this.buttons.thumbnailImageUrl,
            text: this.buttons.text,
            actions: this.buttons.build()
        }
    };
    return message;
};

/*
 * carousel template message definition
 */
var CarouselMessage = function() {
    this.columns = [];
};

CarouselMessage.prototype.addColumn = function(buttonsAsColumn) {
    this.columns.push(buttonsAsColumn);
};

CarouselMessage.prototype.build = function() {
    var message = {
        type: 'template',
        altText: 'スマホじゃないと話せないんだよね…。',
        template: {
            type: 'carousel',
            text: this.text,
            columns: []
        }
    };
    // TODO: this.actionsがなければエラー
    for (var c of this.columns) {
        var colobj = {
            thumbnailImageUrl: c.thumbnailImageUrl,
            text: c.text,
            actions: c.build()
        }
        message.template.columns.push(colobj);
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

Reply.prototype.addMessage = function(message) {
    this.messages.push(message);
};

Reply.prototype.addTextMessage = function(text) {
    var message = {
        type: 'text',
        text: text
    };
    this.addMessage(message);
};

Reply.prototype.addButtonsMessage = function(buttons) {
    this.addMessage(buttons.build());
};

Reply.prototype.addCarouselMessage = function(carousel) {
    console.log(carousel.build());
    this.addMessage(carousel.build());
};

Reply.prototype.execute = function() {
    // TODO: エラーハンドリング
    request({
        url: 'https://api.line.me/v2/bot/message/reply',
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
        },
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
        var buttons = new Buttons('いつ？');
        buttons.addAction('今日', "{ \"date\": \"today\" }");
        buttons.addAction('明日', "{ \"date\": \"tomorrow\" }");
        buttons.addAction('あさって', "{ \"date\": \"after_tomorrow\" }");
        buttons.addAction('それ以外', "{ \"date\": \"none_of_them\" }");
        ask.addButtonsMessage(new ButtonsMessage(buttons));
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

        var carousel = new CarouselMessage();

        var column_morning = new Buttons('朝');
        column_morning.addThumbnailImageUrl('https://bbbot-a63225.apaas.us6.oraclecloud.com/images/morning.jpg');
        column_morning.addAction('9時', "{ \"time\": 9 }");
        column_morning.addAction('10時', "{ \"time\": 10 }");
        column_morning.addAction('11時', "{ \"time\": 11 }");
        carousel.addColumn(column_morning);

        var column_daytime = new Buttons('昼');
        column_daytime.addThumbnailImageUrl('https://bbbot-a63225.apaas.us6.oraclecloud.com/images/daytime.jpg');
        column_daytime.addAction('13時', "{ \"time\": 13 }");
        column_daytime.addAction('14時', "{ \"time\": 14 }");
        column_daytime.addAction('15時', "{ \"time\": 15 }");
        carousel.addColumn(column_daytime);

        var column_evening = new Buttons('夜');
        column_evening.addThumbnailImageUrl('https://bbbot-a63225.apaas.us6.oraclecloud.com/images/evening.jpg');
        column_evening.addAction('16時', "{ \"time\": 17 }");
        column_evening.addAction('17時', "{ \"time\": 17 }");
        column_evening.addAction('それ以外', "{ \"time\": \"none_of_them\" }");
        carousel.addColumn(column_evening);

        ask.addCarouselMessage(carousel);
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
        var buttons = new Buttons('なんぷん？');
        buttons.addAction('30分', "{ \"duration\": 30 }");
        buttons.addAction('60分', "{ \"duration\": 60 }");
        buttons.addAction('それ以外', "{ \"duration\": \"none_of_them\" }");
        ask.addButtonsMessage(new ButtonsMessage(buttons));
        ask.execute();
    }

    static room(replyToken, botMemory) {
        var ask = new Reply(replyToken);
        ask.addTextMessage(botMemory.duration + '分だね！');
        var buttons = new Buttons('開いている部屋はこれだよ。どれがいい？');
        buttons.addAction('15M1', "{ \"room\": \"15M1\" }");
        buttons.addAction('17M2', "{ \"room\": \"17M2\" }");
        buttons.addAction('19M3', "{ \"room\": \"19M3\" }");
        buttons.addAction('20M6', "{ \"room\": \"20M6\" }");
        ask.addButtonsMessage(new ButtonsMessage(buttons));
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
