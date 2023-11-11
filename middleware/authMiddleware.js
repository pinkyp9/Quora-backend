import jwt from 'jsonwebtoken';

const authenticateUser = async(req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    
    console.log(token);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided.' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verified);
    req._id = verified.userId;
    next();
    
};

export default authenticateUser;
