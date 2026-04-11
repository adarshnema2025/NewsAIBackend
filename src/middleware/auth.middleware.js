const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token",token);
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};


//Steps
//1.We extract token
// 2.Check if tokens is available or not
//3.If yes then will move to try catch block
//where using jwt.verify does two things and returns decoded info to req.user and send further 
// jwt.verify() does 2 main things:

// Validates the token
// Checks if token is properly signed using JWT_SECRET
// Checks if token is expired (if exp exists)
// If invalid → throws error → goes to catch
// Decodes the token payload
// If valid → returns the original payload that was used when creating the token
