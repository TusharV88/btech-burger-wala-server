import passport from 'passport';
import User from '../models/User.js';
import { Strategy as Google } from 'passport-google-oauth20';

export const connectPassport = () => {
    passport.use(new Google({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
        async function (request, accessToken, refreshToken, profile, done) {
            const user = await User.findOne({
                googleId: profile.id,
            });

            if (!user) {
                const newUser = await User.create({
                    name: profile.displayName,
                    photo: profile.photos[0].value,
                    googleId: profile.id,
                    cookie: "null"
                });
                // const user = await User.findByIdAndUpdate(req.newUser._id, { cookie: req.cookies["connect.sid"] });

                // console.log("New User: " + user);
                return done(null, newUser);
            } else {
                console.log("User: " + user);
                return done(null, user);
            }
        }));


    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });


};

