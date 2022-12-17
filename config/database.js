import mongoose from "mongoose";

export const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI).then(con => {
        console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
    }).catch(err => {
        console.log(err);
    });
}   