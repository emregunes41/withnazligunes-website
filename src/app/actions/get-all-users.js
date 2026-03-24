"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function getAllUsers() {
  try {
    const session = await getServerSession(authOptions);
    
    // Authorization: Only ADMIN role can fetch all users
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return { error: "Yetkisiz erişim" };
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        gender: true,
        age: true,
        createdAt: true,
        purchases: {
          select: {
            id: true
          }
        }
      }
    });

    return { users };
  } catch (error) {
    console.error("Get all users error:", error);
    return { error: "Kullanıcı listesi alınamadı" };
  }
}
