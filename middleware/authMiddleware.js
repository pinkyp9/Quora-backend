// authMiddleware.js
import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
    // Get the token from the request headers or other sources (e.g., cookies, query parameters)
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
        }

        // Attach the decoded user ID to the request for use in protected routes
        req._id = decoded._id;
        next();
    });
};

export default authenticateUser;
