import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';

import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import fragmentRoutes from './modules/fragments/fragment.routes.js';
import echoRoutes from './modules/echoes/echo.routes.js';
import atmosphereRoutes from './modules/atmosphere/atmosphere.routes.js';
import capsuleRoutes from './modules/capsules/capsule.routes.js';    // ← new

const app = express();

app.use(helmet());
app.use(cors({
    origin: ENV.CLIENT_URL, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/fragments', fragmentRoutes);
app.use('/api/echoes', echoRoutes);
app.use('/api/atmosphere', atmosphereRoutes);
app.use('/api/capsules', capsuleRoutes);

app.use(errorMiddleware);

connectDB().then(() => {
    app.listen(ENV.PORT, () => console.log(`✨ Server running on port ${ENV.PORT}`));
});