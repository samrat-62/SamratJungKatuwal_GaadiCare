import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './database/connect.js';
import authRouter from './routes/authRoute.js';
import setAuthUser from './middleware/setAuthUser.js';
import path from 'path';
import commonRouter from './routes/commonRoute.js';
import setupSocket from './service/socket-service/index.js';
import checkVehicleServiceStatus from './middleware/checkVehicleForService.js';
import { startServiceReminderCron } from './service/node-cron/serviceReminderCron.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8080;
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
app.use(express.static(path.resolve("./Upload")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(setAuthUser);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.use('/api/auth', authRouter);
app.use("/api/common",commonRouter);


server.listen(PORT,async () => {
  console.log(`Server is running on port ${PORT}`);
  await startServiceReminderCron();
});

setupSocket(server);  
