import passport from 'passport';
import User from '../models/User.js';
import { Strategy as Google } from 'passport-google-oauth20';

export const connectPassport = () => {
    passport.use(new Google({
        clientID: process.env.Google_Client_ID,
        clientSecret: process.env.Google_Client_Secret,
        callbackURL: process.env.Google_Callback_URL,
    },
        async function (request, accessToken, refreshToken, profile, done) {
            const user = await User.findOne({
                googleId: profile.id,
            });

            if (!user) {
                const newUser = await User.create({
                    name: profile.displayName,
                    photo: profile.photos[0].value,
                    googleId: profile.id
                });

                return done(null, newUser);
            } else {
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
