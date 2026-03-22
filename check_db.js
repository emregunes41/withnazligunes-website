import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const admins = await prisma.admin.findMany();
  console.log("Current Admins:", admins);
  
  // Clean up if there's an admin so they can try again
  if (admins.length > 0) {
    await prisma.admin.deleteMany();
    console.log("Deleted all admins. System is reset for first login.");
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
