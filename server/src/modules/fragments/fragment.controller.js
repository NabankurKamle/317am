import * as fragmentService from './fragment.service.js';

export const getFragments = async (req, res, next) => {
    try {
        const fragments = await fragmentService.getUserFragments(req.user.id);
        res.json(fragments);
    } catch (err) { next(err); }
};

export const createFragment = async (req, res, next) => {
    try {
        const fragment = await fragmentService.createFragment(req.user.id, req.body);
        res.status(201).json(fragment);
    } catch (err) { next(err); }
};

export const updateFragment = async (req, res, next) => {
    try {
        const fragment = await fragmentService.updateFragment(req.params.id, req.user.id, req.body);
        res.json(fragment);
    } catch (err) { next(err); }
};

export const deleteFragment = async (req, res, next) => {
    try {
        await fragmentService.deleteFragment(req.params.id, req.user.id);
        res.json({ message: 'Fragment released.' });
    } catch (err) { next(err); }
};