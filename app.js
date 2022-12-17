import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import cors from 'cors';

// Environment variables
const app = express();
export default app;
dotenv.config({ path: './config/.env' });

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
    cors({
        origin: "https://btech-burger-wala.onrender.com",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

// Routes
import userRoute from './routes/user.js';
import orderRoute from './routes/order.js';

app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);


// Error Handler
app.use(errorMiddleware);
