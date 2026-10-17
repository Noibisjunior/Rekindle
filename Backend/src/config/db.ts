import mongoose from 'mongoose';
import dns from 'node:dns';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env';

let memoryServer: MongoMemoryServer | null = null;

function configureMongoDns() {
  const publicDns = ['1.1.1.1', '8.8.8.8'];
  try {
    const current = dns.getServers();
    const hasLocalResolver = current.some((server) => /127\.0\.0\.53|127\.0\.0\.1/.test(server));
    if (!current.length || hasLocalResolver) {
      dns.setServers(publicDns);
      console.log('MongoDB SRV resolution: using public DNS servers 1.1.1.1 and 8.8.8.8');
    }
  } catch (error) {
    console.warn('MongoDB DNS override was skipped.', error);
  }
}

export async function connectDB() {
  mongoose.set('strictQuery', true);
  configureMongoDns();

  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('MongoDB connected');
    return;
  } catch (error) {
    const allowLocalFallback = process.env.ALLOW_LOCAL_FALLBACK !== 'false';
    if (process.env.NODE_ENV === 'production' && !allowLocalFallback) {
      throw error;
    }

    const isAtlasSrv = env.MONGO_URI.startsWith('mongodb+srv://');
    if (isAtlasSrv) {
      console.warn('MongoDB Atlas SRV lookup failed. This usually means DNS, ISP, or Node resolver issues. Check Atlas Network Access and DNS settings.', error);
    }

    console.warn('MongoDB connection failed. Falling back to in-memory MongoDB for local development.', error);
    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
    console.log('MongoDB connected using in-memory server');
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
