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
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'None',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}));
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

// Google Passport Strategy
connectPassport();

// Routes
import userRoute from './routes/user.js';
import orderRoute from './routes/order.js';

app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);


// Error Handler
app.use(errorMiddleware);
