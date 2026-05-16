import { Agenda } from 'agenda';
import { MongoBackend } from '@agendajs/mongo-backend';
import { ENV } from '../config/env.js';

export const agenda = new Agenda({
    backend: new MongoBackend({
        address: ENV.MONGO_URI,
        collection: '317am_jobs',
    }),
    processEvery: '1 minute',
    defaultConcurrency: 5,
    maxConcurrency: 20,
});

agenda.on('ready', () => console.log('🗓  Agenda scheduler ready'));
agenda.on('error', (err) => console.error('❌ Agenda error:', err));