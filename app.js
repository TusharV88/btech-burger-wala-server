import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import { connectPassport } from './utils/auth.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import cors from 'cors';

// Environment variables
const app = express();
export default app;
dotenv.config({ path: './config/.env' });

// Middlewares
app.set("trust proxy", 1);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: "lax",
        secure: true,
        httpOnly: true,
        path: "/",
    }
}));
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:4000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);
app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());

// Google Passport Strategy
connectPassport();

// Routes
import userRoute from './routes/user.js';
import orderRoute from './routes/order.js';

app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);


// Error Handler
app.use(errorMiddleware);
