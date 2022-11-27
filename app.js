import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import { connectPassport } from './utils/auth.js';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import cors from 'cors';

// Environment variables
const app = express();
export default app;
dotenv.config({ path: './config/.env' });

// Middlewares
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? false : "none",
    },
}));

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);
app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
app.enable("trust proxy");


// Google Passport Strategy
connectPassport();

// Routes
import userRoute from './routes/user.js';
import orderRoute from './routes/order.js';

app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);


// Error Handler
app.use(errorMiddleware);
