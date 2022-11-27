import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    shippingInfo: {
        hNo: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },

        country: {
            type: String,
            required: true,
        },
        pinCode: {
            type: Number,
            required: true,
        },
        phoneNo: {
            type: Number,
            required: true,
        },
    },

    orderItems: {
        alooTikkiBurger: {
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },

        mexicanAlooTikkiBurger: {
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },

        cornAndCheeseBurger: {
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },

        veggieBurger: {
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },

        spicyPannerBurger: {
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },

        masalaEggBurger: {
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },

        chickenKebabBurger: {
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },

        chickenBurger: {
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },

        grilledChickenAndCheeseBurger: {
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },

        filetOFishBurger: {
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },

    paymentMethod: {
        type: "String",
        enum: ["COD", "Online"],
        default: "COD",
    },

    paymentInfo: {
        type: mongoose.Schema.ObjectId,
        ref: "Payment",
    },
    paidAt: Date,

    itemsPrice: {
        type: Number,
        default: 0,
    },
    taxPrice: {
        type: Number,
        default: 0,
    },
    shippingCharges: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        default: 0,
    },

    orderStatus: {
        type: String,
        enum: ["Preparing", "Shipped", "Delivered"],
        default: "Preparing",
    },

    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


export const Order = mongoose.model("Order", OrderSchema);