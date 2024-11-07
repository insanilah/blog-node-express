import rabbit from './rabbit.js';

const publishMessage = async (exchange, routingKey, message) => {
    const channel = rabbit.getChannel();
    if (!channel) {
        throw new Error("RabbitMQ channel is not initialized");
    }

    const messageBuffer = Buffer.from(JSON.stringify(message));
    channel.publish(exchange, routingKey, messageBuffer, {
        persistent: true, // Pengaturan persistence
    });

    console.log(`Message sent to exchange "${exchange}" with routing key "${routingKey}"`);
};

// Contoh penggunaan publishMessage
const publishArticleNotification = async (message) => {
    await publishMessage('article_exchange', 'article.published', message);
};

const publishUserRegistration = async (message) => {
    await publishMessage('user_exchange', 'user.registered', message);
};

export default {
    publishArticleNotification,
    publishUserRegistration
}