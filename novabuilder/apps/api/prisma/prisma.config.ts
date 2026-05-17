// Prisma v7 runtime config
import { PrismaPg } from '@prisma/adapter-pg';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://novabuilder:novabuilder@localhost:5432/novabuilder';

export default {
  adapter: new PrismaPg(DATABASE_URL),
  logging: {
    level: 'info'
  }
};
