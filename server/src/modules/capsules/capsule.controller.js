import * as capsuleService from './capsule.service.js';

export const getCapsules = async (req, res, next) => {
    try {
        const capsules = await capsuleService.getUserCapsules(req.user.id);
        res.json(capsules);
    } catch (err) { next(err); }
};

export const createCapsule = async (req, res, next) => {
    try {
        const capsule = await capsuleService.createCapsule(req.user.id, req.body);
        res.status(201).json(capsule);
    } catch (err) { next(err); }
};

export const getCapsule = async (req, res, next) => {
    try {
        const capsule = await capsuleService.getCapsuleById(req.params.id, req.user.id);

        // Blocked if sealed
        if (!capsule.isUnlocked) {
            return res.status(403).json({
                message: 'This capsule is still sealed.',
                unlockAt: capsule.unlockAt,
            });
        }

        res.json(capsule);
    } catch (err) { next(err); }
};

export const updateCapsule = async (req, res, next) => {
    try {
        const capsule = await capsuleService.updateCapsule(req.params.id, req.user.id, req.body);
        res.json(capsule);
    } catch (err) { next(err); }
};

export const deleteCapsule = async (req, res, next) => {
    try {
        await capsuleService.deleteCapsule(req.params.id, req.user.id);
        res.json({ message: 'Capsule released into the night.' });
    } catch (err) { next(err); }
};

export const getUpcoming = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const capsules = await capsuleService.getUpcomingCapsules(req.user.id, days);
        res.json(capsules);
    } catch (err) { next(err); }
};