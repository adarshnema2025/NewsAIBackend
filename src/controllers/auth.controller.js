const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.json({ id: user.id, name: user.name, email: user.email });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const token = await authService.login(req.body);
        res.json({ token });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

// Called after successful Google OAuth2 round-trip
exports.oauthCallback = (req, res) => {
    try {
        const user = req.user;
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );
        const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
        res.redirect(`${frontendURL}/auth/callback?token=${token}`);
    } catch (err) {
        res.redirect("http://localhost:5173/login?error=oauth_failed");
    }
};