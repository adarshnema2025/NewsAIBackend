const router = require("express").Router();
const passport = require("passport");
const ctrl = require("../controllers/auth.controller");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);

// Google OAuth2
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:5173/login?error=oauth_failed", session: true }),
    ctrl.oauthCallback
);

module.exports = router;