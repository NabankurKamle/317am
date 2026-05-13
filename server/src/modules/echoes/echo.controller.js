import * as echoService from './echo.service.js';

export const getEchoes = async (req, res, next) => {
    try {
        res.json(await echoService.getUserEchoes(req.user.id));
    } catch (err) { next(err); }
};

export const createEcho = async (req, res, next) => {
    try {
        res.status(201).json(await echoService.createEcho(req.user.id, req.body));
    } catch (err) { next(err); }
};

export const deleteEcho = async (req, res, next) => {
    try {
        await echoService.deleteEcho(req.params.id, req.user.id);
        res.json({ message: 'Echo dissolved.' });
    } catch (err) { next(err); }
};