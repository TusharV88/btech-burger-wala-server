import { asyncError } from "../middleware/errorMiddleware.js";
import { Contact } from "../models/Contact.js";
import { Order } from "../models/Order.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

export const loginToken = async (req, res, next) => {
    console.log("Token User: " + req.user._id);
    const user = await User.findById(req.user._id);
    const token = user.generateToken();
    res.status(200).cookie(
        "burger-token",
        token,
        {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).redirect("https://btech-burger-wala.onrender.com");
};

export const myProfile = (req, res, next) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
}

export const logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err);

        res.clearCookie("connect.sid", {
            secure: true,
            httpOnly: true,
            sameSite: "none",
        });
        res.status(200).json({
            message: "Logged out",
        });
    });
}

export const getAdminUsers = asyncError(async (req, res, next) => {
    const users = await User.find({});

    res.status(200).json({
        success: true,
        users,
    });
});

export const getAdminStats = asyncError(async (req, res, next) => {
    const usersCount = await User.countDocuments();

    const orders = await Order.find({});

    const preparingOrders = orders.filter((i) => i.orderStatus === "Preparing");
    const shippedOrders = orders.filter((i) => i.orderStatus === "Shipped");
    const deliveredOrders = orders.filter((i) => i.orderStatus === "Delivered");

    let totalIncome = 0;

    orders.forEach((i) => {
        totalIncome += i.totalAmount;
    });

    res.status(200).json({
        success: true,
        usersCount,
        ordersCount: {
            total: orders.length,
            preparing: preparingOrders.length,
            shipped: shippedOrders.length,
            delivered: deliveredOrders.length,
        },
        totalIncome,
    });
});

export const contactDetails = asyncError(async (req, res, next) => {
    const { name, email, message } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILID,
            pass: process.env.MAILPASS
        }
    });

    const mailOptions = {
        from: process.env.MAILID,
        to: email,
        subject: `Thank you for reaching to us ${name}`,
        text: `Hi ${name},\n\nThank you for reaching out to learn more about B.Tech Burger Wala. We try hard to make our products best in the world. We wants to provide different flavours cross the world inside a burger.\n\nWinner winner burger dinner.\n\nBest Regards,\nB.Tech Burger Wala`,
    };

    transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
            res.status(500).json({
                success: false,
                message: "Something went wrong. Please try again later."
            });
        } else {
            const contact = await Contact.create({
                name,
                email,
                message,
            });

            res.status(200).json({
                success: true,
                message: "Please check your email for more details",
            });
        }
    });



});

