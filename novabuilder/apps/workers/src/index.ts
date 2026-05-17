import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
const connection = new Redis({ host: process.env.REDIS_HOST || '127.0.0.1', port: Number(process.env.REDIS_PORT || 6379) });
const queue = new Queue('jobs', { connection });
new Worker('jobs', async (job) => {
  console.log(`Processing job ${job.id}`);
}, { connection });
console.log('NovaBuilder worker started');
export { queue };
