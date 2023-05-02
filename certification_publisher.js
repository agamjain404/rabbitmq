import { AMQPClient } from "@cloudamqp/amqp-client";
import {} from 'dotenv/config';

async function startPublisher() {
    const cloudAMQPURL = process.env.CLOUDAMQP_URL;
    const connection  = new AMQPClient(cloudAMQPURL);
    await connection.connect();
    const channel = await connection.channel();

    await channel.exchangeDeclare('exchange.69aeef6a-beb9-4f4e-b602-29e00b3dc9a1', 'direct');
    await channel.queue('exam');
    await channel.queueBind('exam', 'exchange.69aeef6a-beb9-4f4e-b602-29e00b3dc9a1', '69aeef6a-beb9-4f4e-b602-29e00b3dc9a1');
    await channel.basicPublish('exchange.69aeef6a-beb9-4f4e-b602-29e00b3dc9a1', '69aeef6a-beb9-4f4e-b602-29e00b3dc9a1', Buffer.from('Hi CloudAMQP, this was fun!', 'utf-8'), { deliveryMode: 2 });
    await channel.queueUnbind('exam', 'exchange.69aeef6a-beb9-4f4e-b602-29e00b3dc9a1', '69aeef6a-beb9-4f4e-b602-29e00b3dc9a1');
    await channel.exchangeDelete('exchange.69aeef6a-beb9-4f4e-b602-29e00b3dc9a1');
    await channel.close();
    await connection.close();
    console.log('Connection Closed!!');
}

startPublisher();