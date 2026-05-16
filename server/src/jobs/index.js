import { agenda } from './agenda.js';

import './definitions/capsuleUnlock.job.js';

export const startScheduler = async () => {
    await agenda.start();
    console.log('🗓  Job scheduler started');
};

export { agenda };