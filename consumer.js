import { AMQPClient } from "@cloudamqp/amqp-client";
import {} from 'dotenv/config';

async function startConsumer() {

    // set up connection same as publisher
    const cloudAMQPURL = process.env.CLOUDAMQP_URL;
    const connection = new AMQPClient(cloudAMQPURL)
    await connection.connect()
    const channel = await connection.channel()


    // Get queue instance
    const q = await channel.queue('email.notifications')

    let counter = 0;

    // Create consumers by subscribing on queue
    const consumer = await q.subscribe({noAck: false}, async (msg) => {
        try {
            console.log(`[📤] Message received (${++counter})`, msg.bodyToString())
            // Send acknowledgement post consuming
            msg.ack()
        } catch (error) {
            console.error(error)
        }
    });

    // Close connection on exiting the terminal.
    process.on('SIGINT', () => {
        channel.queueDelete('email.notifications');
        channel.exchangeDelete('emails');
        channel.close();
        connection.close()
        console.log("[❎] Connection closed")
        process.exit(0)
    });
}

startConsumer().catch(console.error);