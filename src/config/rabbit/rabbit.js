import amqplib from 'amqplib';

const ARTICLE_EXCHANGE = 'article_exchange';
const ARTICLE_QUEUE = 'article_notification_queue';
const ARTICLE_ROUTING_KEY = 'article.published';

const USER_EXCHANGE = 'user_exchange';
const USER_QUEUE = 'user_registration_queue';
const USER_ROUTING_KEY = 'user.registered';

let channel;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqplib.connect('amqp://localhost');
        channel = await connection.createChannel();

        // Exchange dan Queue untuk artikel
        await channel.assertExchange(ARTICLE_EXCHANGE, 'direct', { durable: true });
        await channel.assertQueue(ARTICLE_QUEUE, { durable: true });
        await channel.bindQueue(ARTICLE_QUEUE, ARTICLE_EXCHANGE, ARTICLE_ROUTING_KEY);

        // Exchange dan Queue untuk registrasi pengguna
        await channel.assertExchange(USER_EXCHANGE, 'direct', { durable: true });
        await channel.assertQueue(USER_QUEUE, { durable: true });
        await channel.bindQueue(USER_QUEUE, USER_EXCHANGE, USER_ROUTING_KEY);

        console.log("RabbitMQ connected and exchanges/queues set up successfully.");
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
};

const getChannel = () => channel;

export default {
    connectRabbitMQ,
    getChannel
};
