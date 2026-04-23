const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport.config");
const app = express();

//middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
}));

// ✅ CRITICAL FIX for preflight
app.options("*", cors());
app.use(express.json());

// Session middleware – required for Passport OAuth round-trip
app.use(session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "oauth_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 5 * 60 * 1000 }, // 5 min – only needed during OAuth handshake
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/notebooks", require("./routes/notebook.routes"));
app.use("/api/archives", require("./routes/archive.routes"));

app.use("/api/news", require("./routes/news.routes"));

app.use("/api", require("./routes/pdf.routes"));
module.exports = app;


