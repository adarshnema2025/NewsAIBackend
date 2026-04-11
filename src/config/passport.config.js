const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models");

if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID.includes("your_google_client_id_here")) {
    console.warn("WARNING: GOOGLE_CLIENT_ID is not set or is a placeholder. Google Sign In will NOT work.");
}
if (!process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET.includes("your_google_client_secret_here")) {
    console.warn("WARNING: GOOGLE_CLIENT_SECRET is not set or is a placeholder. Google Sign In will NOT work.");
}

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                const name = profile.displayName;
                const googleId = profile.id;

                console.log(`Google OAuth Attempt: ${email} (${googleId})`);

                // 1. Try to find by googleId
                let user = await User.findOne({ where: { googleId } });

                if (!user && email) {
                    // 2. Try to find by email (link existing account)
                    user = await User.findOne({ where: { email } });
                    if (user) {
                        console.log(`Linking existing account for ${email} to Google ID ${googleId}`);
                        await user.update({ googleId });
                    }
                }

                if (!user) {
                    console.log(`Creating new Google user: ${email}`);
                    // 3. Create a brand-new OAuth user
                    user = await User.create({
                        name,
                        email,
                        googleId,
                        password_hash: null,
                    });
                }

                return done(null, user);
            } catch (err) {
                console.error("Google OAuth Strategy Error:", err);
                return done(err, null);
            }
        }
    )
);

// Minimal serialize/deserialize – only used during the OAuth redirect round-trip
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
