import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// REGISTER USER

export const register = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        picturePath,
        location,
        occupation,
        viewedProfile,
        impressions
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // Await the hash function
    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword, // Use the awaited hashed password
        picturePath,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random() * 1000), // Random viewed profile
        impressions: Math.floor(Math.random() * 1000), // Random impressions
    });
    try {
        const saveUser = await newUser.save();
        res.status(200).json(saveUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGIN USER

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist." })
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.statur(400).json({ msg: "Invalid Credentials" })
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ user, token });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
