import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://novabuilder:novabuilder@localhost:5432/novabuilder';

const prisma = new PrismaClient({
  adapter: new PrismaPg(DATABASE_URL)
});

export default prisma;
