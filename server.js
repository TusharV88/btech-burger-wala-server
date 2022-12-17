import app from './app.js';
import { connectDB } from './config/database.js';
import Razorpay from 'razorpay';
import cloudinary from 'cloudinary';

connectDB();

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

app.get('/', (req, res) => {
    res.send('<a href="/api/v1/auth/google">Authentication with Google</a>');
});


app.listen(process.env.PORT, () => {
    console.log(`Server is working on PORT: ${process.env.PORT}`);
}).on('error', (err) => {
    console.log(err);
}
);
