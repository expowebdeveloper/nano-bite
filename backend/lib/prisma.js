import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// Create PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter for PostgreSQL
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({ adapter });

export { prisma };