import { prisma } from '../lib/prisma.js';

// Test Prisma database connection
async function connectDB() {
  try {
    await prisma.$connect();
    console.log("📦 PostgreSQL Connected via Prisma");
  } catch (err) {
    console.error("❌ PostgreSQL Connection Error:", err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export { connectDB, prisma };
