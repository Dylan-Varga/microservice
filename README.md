# Message Generator

Author: Dylan Varga

Purpose: Recieve message request through rabbitMQ pipeline 'messageRQ' and return random message throguh rabbitMQ pipeline 'pomodoroMessage'

## Communication Contract:

### Requesting Data: 

Create a new pipeline and queue using RabbitMQ. In JS this is done as follows: 
```
connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'messageRQ';
});
```
In Python, it is done as follows:
```
connection = pika.BlockingConnection(pike.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='messageRQ')
```
What's important is that the queue name is `'messageRQ'`.

Once the connection and queue are established, publish the message `'send_message'` to the queue:
```
message = 'send_message'
channel.basic_publish(exchange='', routing_key='messageRQ', body=message)
```
or, if in JS,
```
    var msg = 'send_message';
    channel.sendToQueue(queue, Buffer.from(msg));
```

### Receiving Data: 

Receiving works similarly to sending. We'll create a seperate queue called `'pomodoroMessage'`
```
channel.queue_declare(queue='pomodoroMessage')
```
or, in JS,
```
connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var receiveQueue = 'pomodoroMessage';
});
```
Then check that queue for the now-incoming randomly generated "congrats" message:
```
def callback(ch, method, properties, body):
    message = body.decode('utf-8')
channel.start_consuming()
channel.basic_consume(queue='pomodoroMessage', auto_ack=True, on_meesage_callback=callback)
```
In JS,
``` 
    channel.consume(receiveQueue, function(msg) {
        #console.log/save to variable/etc
        console.log("%s", msg.content.toString());
    }, {
        noAck: true
    });
```

### UML Diagram

<img width="800" alt="quotemicroservice" src="https://user-images.githubusercontent.com/96801858/218666964-76b85353-150b-4b24-852f-544e15ac1121.png">
