var amqp = require('amqplib/callback_api');

function returnMessage(randInt){
    var quotes = [
        'Great job! Congrats on your work!',
        'Impressively done! Ready for another round?',
        'Enjoy your break - you\'ve earned it!',
        'You can do anything with enough determination - keep at it!',
        'Good job on making it this far',
        'Keep it up!',
        'You\'ve earned this',
        'Slow and steady is the way to win the race',
        'You\'ve made it this far - what\'s one more Pomodoro cycle?'
    ]
    return quotes[randInt];
}

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'messageRQ';
        var receiveQueue = 'pomodoroMessage';

        channel.assertQueue(queue, {
            durable: false
        });

        channel.assertQueue(receiveQueue, {
            durable: false
        });

        //optional
        //console.log(" [*] Waiting for messages in %s.", queue);
        while(True){
            channel.consume(queue, function(msg) {
                //optional
                //console.log(" [x] Received %s", msg.content.toString());
                var randInt = Math.floor(Math.random() * 8);
                channel.sendToQueue(receiveQueue, Buffer.from(returnMessage(randInt)));
                //optional
                //console.log(" [x] Sent %s", returnMessage());
            }, {
                noAck: true
            });
        }
    });
});
