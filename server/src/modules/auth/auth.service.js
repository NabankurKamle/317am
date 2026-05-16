import jwt from 'jsonwebtoken';
import { User } from '../users/user.model.js';
import { ENV } from '../../config/env.js';

export const signToken = (id) =>
    jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN });

export const registerUser = async ({ username, email, password }) => {
    // Explicit checks so errors are clear
    if (!username || !email || !password) {
        throw Object.assign(new Error('All fields are required.'), { status: 400 });
    }

    const exists = await User.findOne({ $or: [{ email: email.toLowerCase().trim() }, { username: username.trim() },] });
    if (exists) {
        throw Object.assign(new Error('Email or username already in use.'), { status: 409 });
    }

    const user = await User.create({ username: username.trim(), email: email.toLowerCase().trim(), password });
    const token = signToken(user._id);

    return { user, token };
};

export const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw Object.assign(new Error('Email and password required.'), { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password))) {
        throw Object.assign(new Error('Invalid credentials.'), { status: 401 });
    }

    const token = signToken(user._id);
    return { user, token };
};