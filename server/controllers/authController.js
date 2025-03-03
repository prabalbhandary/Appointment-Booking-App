import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";

const generateToken = (user) => {
    return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15d" });
}

const register = async (req, res) => {
    try {
        const {name, email, password, photo, role, gender} = req.body;
        let userExists = null;
        if(role === "patient"){
            userExists = await User.findOne({ email });
        }else if(role === "doctor"){
            userExists = await Doctor.findOne({ email });
        }
        if (userExists) {
            return res.status(400).send({ success: false, message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser;
        if(role === "patient"){
            newUser = new User({
                name,
                email,
                password: hashedPassword,
                photo,
                role,
                gender
            })
        }else if(role === "doctor"){
            newUser = new Doctor({
                name,
                email,
                password: hashedPassword,
                photo,
                role,
                gender
            })
        }
        await newUser.save();
        return res.status(201).send({ success: true, message: 'User registered successfully', token: generateToken(newUser) });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).send({ success: false, message: 'Server Error' });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = null;
        const patient = await User.findOne({ email });
        const doctor = await Doctor.findOne({ email });
        if (patient) {
            user = patient;
        }
        if(doctor){
            user = doctor;
        }
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = generateToken(user);
        res.cookie('token', token, {
            httpOnly: true,
        })
        const {password: _, role, appointments, ...rest} = user._doc;
        return res.status(200).json({ success: true, message: 'User logged in successfully', token, data: {...rest}, role });
    } catch (error) {
        console.error(err);  // Log the error for debugging
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export { register, login };