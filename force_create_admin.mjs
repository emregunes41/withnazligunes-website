import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("Hashing password...");
  const hashedPassword = await bcrypt.hash("123456", 10);
  
  console.log("Wiping existing admins...");
  await prisma.admin.deleteMany();
  
  console.log("Creating requested admin account...");
  const admin = await prisma.admin.create({
    data: {
      username: "admin",
      password: hashedPassword
    }
  });
  
  console.log("✅ SUCCESSFULLY CREATED ADMIN:", admin.username);
  console.log("Password is set to 123456");
}

main().catch(console.error).finally(() => prisma.$disconnect());
