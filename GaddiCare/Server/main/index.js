import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './database/connect.js';
import authRouter from './routes/authRoute.js';
import setAuthUser from './middleware/setAuthUser.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8000;
const CLIENT = process.env.CLIENT_URL || 'http://localhost:5173';
const MONGO=process.env.MONGO_URL || '';

connectDB(MONGO);
app.use(
  cors({
    origin: CLIENT,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(setAuthUser);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.use('/api/auth', authRouter);


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
