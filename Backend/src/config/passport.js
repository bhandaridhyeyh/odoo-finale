// src/config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.model.js";

export default function setupPassport() {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL, // e.g. https://yourdomain.com/api/auth/google/callback
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] && profile.emails[0].value;
          let user = await User.findOne({ $or: [{ oauthId: profile.id }, { email }] });
          if (!user) {
            user = await User.create({
              firstName: profile.name?.givenName || "Google",
              lastName: profile.name?.familyName || "",
              email,
              isVerified: true,
              oauthProvider: "google",
              oauthId: profile.id,
              avatarUrl: profile.photos && profile.photos[0] && profile.photos[0].value,
            });
          } else {
            // If existing user without oauthId, attach it (useful for merging)
            if (!user.oauthId) {
              user.oauthProvider = "google";
              user.oauthId = profile.id;
              user.isVerified = true;
              await user.save();
            }
          }
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}
