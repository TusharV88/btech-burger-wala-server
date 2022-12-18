import { asyncError } from "../middleware/errorMiddleware.js";
import { Order } from "../models/Order.js";
import User from "../models/User.js";
import cloudinary from "cloudinary";
import { sendEmail } from "../middleware/sendEmail.js";
import crypto from "crypto";
import { Contact } from "../models/Contact.js";

export const register = async (req, res) => {
    try {

        const { name, email, password, avatar } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }


        const myCloud = await cloudinary.v2.uploader.upload(avatar, { folder: "avatars" });

        user = await User.create({
            name,
            email,
            password,
            avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
        });

        const token = user.generateToken();

        res.status(201).cookie(
            "token",
            token,
            {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/"
            }).json({
                success: true,
                user,
                token
            });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordMatched = await user.matchPassword(password);

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            });
        }

        const token = user.generateToken();

        res.status(200).cookie(
            "token",
            token,
            {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/"
            }).json({
                success: true,
                user,
                token
            });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const myProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const logout = (req, res, next) => {
    try {
        res
            .status(200)
            .cookie("token", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
                secure: true,
                sameSite: "none"
            })
            .json({
                success: true,
                message: "Logged out successfully",
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const resetPasswordToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `${req.header('Referer')}password/reset/${resetPasswordToken}`;

        const message = `Reset your password by clicking the link below: \n\n ${resetUrl}.`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Reset Password",
                message,
            });

            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email}`,
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid or has expired",
            });
        }

        user.password = req.body.password;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password Updated",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


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
    await Contact.create({
        name,
        email,
        message,
    });

    const msg = `Hi ${name},\n\nThank you for reaching out to learn more about B.Tech Burger Wala. We try hard to make our products best in the world. We wants to provide different flavours cross the world inside a burger.\n\nWinner winner burger dinner.\n\nBest Regards,\nB.Tech Burger Wala`;

    try {
        await sendEmail({
            email,
            subject: `Thank you for reaching to us ${name}`,
            msg
        });

        res.status(200).json({
            success: true,
            message: "Received your message. Please check your email for more details.",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

});

