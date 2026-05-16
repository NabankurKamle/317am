import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { startScheduler } from './jobs/index.js';

import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import fragmentRoutes from './modules/fragments/fragment.routes.js';
import echoRoutes from './modules/echoes/echo.routes.js';
import atmosphereRoutes from './modules/atmosphere/atmosphere.routes.js';
import capsuleRoutes from './modules/capsules/capsule.routes.js';

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'https://317am.vercel.app',
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
}));

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/fragments', fragmentRoutes);
app.use('/api/echoes', echoRoutes);
app.use('/api/atmosphere', atmosphereRoutes);
app.use('/api/capsules', capsuleRoutes);

app.get('/health', (req, res) => res.json({ status: 'awake', env: ENV.NODE_ENV }));

app.use(errorMiddleware);

connectDB().then(async () => {
    await startScheduler();
    app.listen(ENV.PORT, () =>
        console.log(`✨ Server running on port ${ENV.PORT} [${ENV.NODE_ENV}]`)
    );
});