import { AMQPClient } from "@cloudamqp/amqp-client";
import {}  from 'dotenv/config';

async function startPublisher() {
    try {
        // cloud Amqp authentication url for a instance is set up in environment variable
        const cloudAMQPURL = process.env.CLOUDAMQP_URL;

        // Connection creation with rabbit MQ Cloud AMQP URL
        const connection = new AMQPClient(cloudAMQPURL);

        // Settig up connection
        await connection.connect();

        // Creating channel
        const channel = await connection.channel();

        // Declare exchange
        // 1st arg = exchange name
        // 2nd arg = exchange type
        await channel.exchangeDeclare('emails', 'direct');

        // Create queue
        // 1st arg = queue name
        const q = await channel.queue('email.notifications');

        // Bind queue with connection
        // 1st arg = queue name
        // 2nd arg = exchange name
        // 3rd arg = routing key
        await channel.queueBind('email.notifications', 'emails', 'notification');

        //Publish a message to the exchange
        async function sendToQueue(routingKey, email, name, body) {
            const message = { email, name, body }
            const jsonMessage = JSON.stringify(message);
    
            //amqp-client function expects: publish(exchange, routingKey, message, options)
            // Queue publishing the message
            await q.publish('emails', { routingKey }, jsonMessage)
            console.log("[📥] Message sent to queue", message)
        }
  
        //Send some messages to the queue
        sendToQueue("notification", "example@example.com", "John Doe", "Your order has been received");
        sendToQueue("notification", "example@example.com", "Jane Doe", "The product is back in stock");
        sendToQueue("resetpassword", "example@example.com", "Willem Dafoe", "Here is your new password");

        setTimeout(() => {
            //Close the connection
            connection.close()
            console.log("[❎] Connection closed")
            process.exit(0)
        }, 500);
      
    } catch (error) {
        console.error(error)

        //Retry after 3 second
        setTimeout(() => {
        startPublisher()
        }, 3000)

    }
}

// Starting publisher
startPublisher();