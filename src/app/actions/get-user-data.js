"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function getUserData() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return { error: "Yetkisiz erişim" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        reservations: {
          orderBy: { createdAt: 'desc' }
        },
        purchases: {
          orderBy: { purchaseDate: 'desc' }
        }
      }
    });

    return { user };
  } catch (error) {
    console.error("Get user data error:", error);
    return { error: "Veriler alınamadı" };
  }
}
