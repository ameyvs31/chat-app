const jwt = require("jsonwebtoken");

// This function runs BEFORE protected routes
// It checks if the request has a valid JWT token
const protectRoute = (req, res, next) => {

  try {
    // Token is sent in the header like:
    // Authorization: "Bearer eyJhbGc..."
    const authHeader = req.headers.authorization;

    // If no token found → reject request
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token. Access denied." });
    }

    // Extract just the token part (remove "Bearer ")
    const token = authHeader.split(" ")[1];

    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user's id to the request object
    // Now any route after this can use req.userId
    req.userId = decoded.userId;

    // Move on to the actual route
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = protectRoute;