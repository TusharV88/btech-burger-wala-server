import app from './app.js';
import { connectDB } from './config/database.js';
import Razorpay from 'razorpay';

connectDB();

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
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
