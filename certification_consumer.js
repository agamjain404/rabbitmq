import { AMQPClient } from "@cloudamqp/amqp-client";
import {} from 'dotenv/config';

async function startConsumer() {
    const cloudAMQPURL = process.env.CLOUDAMQP_URL;
    const connection  = new AMQPClient(cloudAMQPURL);
    await connection.connect();
    const channel = await connection.channel();
    const q = await channel.queue('exam');
    const consumer = await q.subscribe({noAck: true}, async (msg) => {
        console.log(msg);
    });
   await connection.close()
        console.log("[❎] Connection closed")
}

await startConsumer();