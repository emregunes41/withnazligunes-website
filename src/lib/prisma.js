import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  // Vercel'deki sinsi kopyalama hataları (tırnak/boşluk) için ortam değişkenini direkt temizle
  if (process.env.NEON_DATABASE_URL) {
    process.env.NEON_DATABASE_URL = process.env.NEON_DATABASE_URL.trim().replace(/^"|"$/g, '');
  }

  const url = process.env.NEON_DATABASE_URL;
  
  return new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  })
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export { prisma }

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
