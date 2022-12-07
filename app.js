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
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    name: 'burger-token',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days.
        httpOnly: true,
        secure: true,
    }
};

app.set('trust proxy', 1); // trust first proxy
sessionConfig.cookie.secure = true; // serve secure cookies

app.use(session(sessionConfig));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://btech-burger-wala.onrender.com");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
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
