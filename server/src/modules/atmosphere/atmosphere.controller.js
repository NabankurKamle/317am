import { updateMood } from '../users/user.service.js';
import * as atmosphereService from './atmosphere.service.js';

export const logMood = async (req, res, next) => {
    try {
        const entry = await atmosphereService.logMood(req.user.id, req.body);

        if (entry) await updateMood(req.user.id, req.body.mood)

        res.status(201).json(entry);
    } catch (err) { next(err); }
};

export const getMoodHistory = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        res.json(await atmosphereService.getMoodHistory(req.user.id, limit));
    } catch (err) { next(err); }
};

export const getMoodStats = async (req, res, next) => {
    try {
        res.json(await atmosphereService.getMoodStats(req.user.id));
    } catch (err) { next(err); }
};