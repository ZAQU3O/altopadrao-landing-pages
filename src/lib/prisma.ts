import { PrismaClient } from '@prisma/client';
import { INITIAL_SPACES } from './seed-data';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  seedPromise?: Promise<void>;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function ensureSeeded() {
  if (globalForPrisma.seedPromise) {
    return globalForPrisma.seedPromise;
  }

  globalForPrisma.seedPromise = (async () => {
    try {
      const count = await prisma.space.count();
      if (count > 0) return;

      for (const spaceData of INITIAL_SPACES) {
        await prisma.space.create({
          data: spaceData,
        });
      }
    } catch (err) {
      console.error('Seed error:', err);
    }
  })();

  return globalForPrisma.seedPromise;
}
