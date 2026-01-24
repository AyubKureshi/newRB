import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from "../model/userSchema.js";

const SALT_ROUNDS = 10;

export const postRegister = async (req,res) => {
    try {
        const { name, email, password } = req.body;
        if(!name) return res.status(400).json({ error: "Name is required" });
        if(!email || !password) return res.status(400).json({ error: "Email and password required" });

        const existing = await User.findOne({ email });
        if(existing) return res.status(409).json({ error: "User already exists" });

        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        const user = new User({ name, email, password: hashed });
        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

        res.json({ message: "User registered", user: { id: user._id, name: user.name, email: user.email }, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export const postLogin = async (req,res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) return res.status(400).json({ error: "Email and password required" });

        const user = await User.findOne({ email });
        if(!user) return res.status(401).json({ error: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

        res.json({ message: "Login successful", user: { id:user._id, name: user.name, email: user.email }, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}