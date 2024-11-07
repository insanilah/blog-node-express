import rabbit from './rabbit.js';

// Fungsi untuk mendengarkan pesan dari artikel queue
const consumeArticleNotifications = async () => {
    const channel = rabbit.getChannel();
    if (!channel) {
        throw new Error("RabbitMQ channel is not initialized");
    }

    channel.consume('article_notification_queue', (message) => {
        if (message !== null) {
            const content = JSON.parse(message.content.toString());
            console.log("Received article notification:", content);
            // Acknowledge pesan setelah diproses
            channel.ack(message);
        }
    });
};

// Fungsi untuk mendengarkan pesan dari user registration queue
const consumeUserRegistrations = async () => {
    const channel = rabbit.getChannel();
    if (!channel) {
        throw new Error("RabbitMQ channel is not initialized");
    }

    channel.consume('user_registration_queue', (message) => {
        if (message !== null) {
            const content = JSON.parse(message.content.toString());
            console.log("Received user registration:", content);
            // Acknowledge pesan setelah diproses
            channel.ack(message);
        }
    });
};

export default {
    consumeArticleNotifications,
    consumeUserRegistrations
};
