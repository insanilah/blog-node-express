// src/app.js
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import connectMongoDB from './config/mongo.js';
import rabbit from './config/rabbit/rabbit.js';
import consumer from './config/rabbit/consumer.js';
import dotenv from 'dotenv';

dotenv.config();
connectMongoDB();

(async () => {
  await rabbit.connectRabbitMQ();
  await consumer.consumeArticleNotifications();
  await consumer.consumeUserRegistrations();
})();

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;
