import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if(!token || !token.startsWith("Bearer ")){
            return res.status(401).json({ success: false, message: 'No Token Provided' });
        }
        const actualToken = token.split(" ")[1];
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET)
        req.userId = decoded.userId;
        req.role = decoded.role;
        const userId = decoded.userId;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token Expired' });
        }
        console.error(error.message);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

const restrict = (roles) => async (req, res, next) => {
    try {
        const userId = req.userId;
        let user = await User.findById(userId);
        if(!user){
            user = await Doctor.findById(userId);
        }
        if(!user){
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if(!roles.includes(user.role)){
            return res.status(403).json({ success: false, message: 'You are not authorized' });
        }
        next();
    } catch (error) {
        console.error('Restrict middleware error:');
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export { authenticateToken, restrict };